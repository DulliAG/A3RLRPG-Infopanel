import { useScreenSize } from '@dulliag/components';
import { Box, Chip, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import { NoItems } from '../components/core/no-items.component';
import { Progress } from '../components/core/progress.component';
import { Server, ServerProps } from '../components/server.component';
import { StoreContext } from '../context/store.context';
import { PanthorService } from '../services/panthor.service';

export const Home = () => {
  const id = React.useId();
  const screenSize = useScreenSize();
  const { loading, setLoading, servers, setServers, selectedServer, setSelectedServer } =
    React.useContext(StoreContext);

  const handleServerClick: ServerProps['onClick'] = (server) => {
    setSelectedServer(server);
  };

  React.useEffect(() => {
    if (servers.length < 1) {
      setLoading(true);
      PanthorService.getServers()
        .then((serverList) => {
          setServers(serverList);
          setSelectedServer(serverList.length >= 1 ? serverList[0] : null);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [servers, setServers, setSelectedServer, setLoading]);

  return (
    <React.Fragment>
      <Box>
        <Typography variant="subtitle1" mb={1}>
          Serverliste
        </Typography>
        {loading ? (
          <Progress />
        ) : servers.length > 0 ? (
          screenSize === 'small' ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                overflowX: 'scroll',
                scrollSnapType: 'x mandatory',
                columnGap: '20px',
              }}
            >
              {servers.map((server) => (
                <Box
                  key={`${id}-server-modile-${server.id}`}
                  sx={{
                    minWidth: '100%',
                    scrollSnapAlign: 'start',
                  }}
                >
                  <Server
                    data={server}
                    onClick={handleServerClick}
                    active={selectedServer?.id === server.id}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <Grid container spacing={3}>
              {servers.map((server) => (
                <Grid key={`${id}-server-desktop-${server.id}`} item xs={12} md={4}>
                  <Server
                    data={server}
                    onClick={handleServerClick}
                    active={selectedServer?.id === server.id}
                  />
                </Grid>
              ))}
            </Grid>
          )
        ) : (
          <NoItems message="Kein Server online" />
        )}
      </Box>

      {selectedServer && (
        <Box mt={2}>
          <Typography variant="subtitle1" mb={1}>
            Spielerliste
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              {selectedServer.players.length > 0 ? (
                <Paper sx={{ p: 2 }}>
                  {selectedServer.players.map((player, index) => (
                    <Chip
                      key={player + '-' + index}
                      label={player}
                      size="small"
                      disabled={player.includes('(Lobby)')}
                      sx={{ mr: 0.5 }}
                    />
                  ))}
                </Paper>
              ) : (
                <NoItems message="Keine Spieler gefunden" />
              )}
            </Grid>
          </Grid>
        </Box>
      )}
    </React.Fragment>
  );
};
