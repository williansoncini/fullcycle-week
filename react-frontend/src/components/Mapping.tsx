// @flow 
import { Button, Grid, MenuItem, Select } from '@mui/material';
import { Loader } from 'google-maps';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { getCurrentPosition } from '../util/geolocation';
import { makeCarIcon, makeMarkerIcon, Map } from '../util/map';
import { Route } from '../util/models';
import { sample, shuffle } from "lodash";
import { useSnackbar } from 'notistack';
import { RouteExistsError } from '../Errors/route-exists.error';
import { styled } from '@mui/system';
import NavBar from './NavBar';
import io from 'socket.io-client'

const API_URL = process.env.REACT_APP_API_URL as string

const googleMapsLoader = new Loader(process.env.REACT_APP_GOOGLE_API_KEY);

const colors = [
  "#b71c1c",
  "#4a148c",
  "#2e7d32",
  "#e65100",
  "#2962ff",
  "#c2185b",
  "#FFCD00",
  "#3e2723",
  "#03a9f4",
  "#827717",
];

const RootContainer = styled(Grid)({
  height: '100%',
  width: '100%'
})

const Form = styled('form')({
  margin: "16px",
})

const BtnSubmitWrapper = styled('div')({
  textAlign: "center",
  marginTop: "8px",
})

const MapContainer = styled('div')({
  width: "100%",
  height: "100%",
})

export const Mapping: React.FunctionComponent = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routeIdSelected, setRouteIdSelected] = useState<string>("");
  const mapRef = useRef<Map>();
  const socketIORef = useRef<SocketIOClient.Socket>();
  const { enqueueSnackbar } = useSnackbar();

  const finishRoute = useCallback(
    (route: Route) => {
      enqueueSnackbar(`${route.title} finalizou!`, {
        variant: "success",
      });
      mapRef.current?.removeRoute(route._id);
    },
    [enqueueSnackbar]
  );

  useEffect(() => {
    if (!socketIORef.current?.connected) {
      socketIORef.current = io.connect(API_URL);
      socketIORef.current.on("connect", () => console.log("conectou"));
    }

    const handler = (data: {
      routeId: string;
      position: [number, number];
      finished: boolean;
    }) => {
      console.log(data);
      mapRef.current?.moveCurrentMarker(data.routeId, {
        lat: data.position[1],
        lng: data.position[0],
      });
      const route = routes.find((route) => route._id === data.routeId) as Route;
      if (data.finished) {
        finishRoute(route);
      }
    };
    socketIORef.current?.on("new-position", handler);
    return () => {
      socketIORef.current?.off("new-position", handler);
    };
  }, [finishRoute, routes, routeIdSelected]);


  useEffect(() => {
    fetch(`${API_URL}/routes`)
      .then((data) => data.json())
      .then((data) => setRoutes(data));
  }, []);

  useEffect(() => {
    (async () => {
      const [, position] = await Promise.all([
        googleMapsLoader.load(),
        getCurrentPosition({ enableHighAccuracy: true }),
      ]);
      const divMap = document.getElementById("map") as HTMLElement;
      mapRef.current = new Map(divMap, {
        zoom: 15,
        center: position,
      });
    })();
  }, []);

  const startRoute = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const route = routes.find((route) => route._id === routeIdSelected);
      const color = sample(shuffle(colors)) as string;
      try {
        mapRef.current?.addRoute(routeIdSelected, {
          currentMarkerOptions: {
            position: route?.startPosition,
            icon: makeCarIcon(color),
          },
          endMarkerOptions: {
            position: route?.endPosition,
            icon: makeMarkerIcon(color),
          },
        });
        socketIORef.current?.emit("new-direction", {
          routeId: routeIdSelected,
        });
      } catch (error) {
        if (error instanceof RouteExistsError) {
          enqueueSnackbar(`${route?.title} já adicionado, espere finalizar.`, {
            variant: "error",
          });
          return;
        }
        throw error;
      }
    },
    [routeIdSelected, routes, enqueueSnackbar]
  );

   return <RootContainer container>
    <Grid item xs={12} sm={3}>
      <NavBar />
      <Form action="" onSubmit={startRoute}>
        <Select 
          fullWidth
          value={routeIdSelected}
          onChange={e => setRouteIdSelected(e.target.value+'')}
          displayEmpty
          >
          <MenuItem value="">
            <em>Selecione uma corrida</em>
          </MenuItem>
          {routes.map((route, key) => {
            return <MenuItem key={key} value={route._id}>
              {route.title}
            </MenuItem>
          })}
        </Select>
        <BtnSubmitWrapper>
          <Button type='submit' color='primary' variant='contained'>Iniciar uma corrida</Button>
        </BtnSubmitWrapper>
      </Form>
    </Grid>
    <Grid item xs={12} sm={9}>
      <MapContainer id='map'/>
    </Grid>
  </RootContainer>
}