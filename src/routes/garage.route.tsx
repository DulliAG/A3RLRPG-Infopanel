import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Accordion, AccordionDetails, Box, Chip, Grid, Typography, useTheme } from '@mui/material';
import React from 'react';
import { AccordionSummary } from '../components/base/accordion-summary.component';
import { Image } from '../components/base/image.component';
import { NoItems } from '../components/core/no-items.component';
import { Progress } from '../components/core/progress.component';
import { LevelProgress } from '../components/level-progress.component';
import { StoreContext } from '../context/store.context';
import { PanthorService } from '../services/panthor.service';

export const Garage = () => {
  const id = React.useId();
  const globalTheme = useTheme();
  const { loading, setLoading, apiKey, vehicles, setVehicles } = React.useContext(StoreContext);
  const [open, setOpen] = React.useState(-1);

  const handleChange =
    (accordion: typeof open) => (event: React.SyntheticEvent, isClosed: boolean) => {
      setOpen(isClosed ? accordion : -1);
    };

  const aliveVehicles = React.useMemo(() => {
    return vehicles
      .filter((vehicle) => !vehicle.disabled && vehicle.alive)
      .sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime());
  }, [vehicles]);

  // const unaliveVehicles = React.useMemo(() => {
  //   return vehicles
  //     .filter((vehicle) => vehicle.alive)
  //     .sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime());
  // }, [vehicles]);

  React.useEffect(() => {
    if (!apiKey) return;
    if (vehicles.length < 1) {
      setLoading(true);
      PanthorService.getVehicles(apiKey)
        .then(setVehicles)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [apiKey, setLoading, setVehicles, vehicles]);

  return (
    <React.Fragment>
      {loading ? (
        <Progress />
      ) : (
        <React.Fragment>
          <Box>
            <Typography variant="subtitle1" mb={1}>
              Fahrzeuge {aliveVehicles.length > 0 && `(${aliveVehicles.length})`}
            </Typography>
            {aliveVehicles.length > 0 ? (
              aliveVehicles.map((vehicle) => (
                <Accordion
                  key={`${id}-house-${vehicle.id}`}
                  expanded={open === vehicle.id}
                  onChange={handleChange(vehicle.id)}
                >
                  <AccordionSummary
                    expanded={open === vehicle.id}
                    expandIcon={<ExpandMoreIcon />}
                    id={`panel${vehicle.id}a-header`}
                  >
                    <Typography sx={{ width: { xs: '100%', md: 'unset' } }}>
                      {vehicle.vehicle_data.name}
                    </Typography>
                    {vehicle.active ? (
                      <Chip label="Ausgeparkt" size="small" sx={{ ml: { xs: 0, md: 1 } }} />
                    ) : null}
                    <Chip
                      label={vehicle.getVehicleTypeLabel()}
                      size="small"
                      sx={{ ml: { xs: vehicle.active ? 1 : 0, md: 1 } }}
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={1}>
                      <Grid item xs={6} md={3}>
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                          Fraktion
                        </Typography>
                        <Chip label={vehicle.side.getLabel()} />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                          Kennzeichen
                        </Typography>
                        <Chip label={vehicle.plate} />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                          Kilometerstand
                        </Typography>
                        <Typography>{vehicle.kilometer_total} Km.</Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                          Garage
                        </Typography>
                        <Typography>
                          {vehicle.active ? 'Ausgeparkt' : vehicle.lastgarage}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                          Tank
                        </Typography>
                        <LevelProgress currentLevel={0} progress={vehicle.fuel * 100} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                          Bild
                        </Typography>
                        <Image
                          src={vehicle.getImage()}
                          alt={vehicle.classname}
                          style={{
                            width: '100%',
                            height: 'auto',
                            aspectRatio: '16/9',
                            borderRadius: `${globalTheme.shape.borderRadius}px`,
                          }}
                          loading="eager"
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <NoItems message="Keine Fahrzeuge vorhanden" />
            )}
          </Box>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
