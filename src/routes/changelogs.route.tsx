import {
  Check as CheckIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { Accordion, AccordionDetails, Chip, Grid, Typography } from '@mui/material';
import { format } from 'date-fns';
import React from 'react';
import { AccordionSummary } from '../components/base/accordion-summary.component';
import { NoItems } from '../components/core/no-items.component';
import { Progress } from '../components/core/progress.component';
import { StoreContext } from '../context/store.context';
import { PanthorService } from '../services/panthor.service';

export const Changelogs = () => {
  const id = React.useId();
  const { loading, setLoading, changelogs, setChangelogs } = React.useContext(StoreContext);
  const [currentChangelog, setCurrentChangelog] = React.useState<string>('');

  const handleChange =
    (version: typeof currentChangelog) => (event: React.SyntheticEvent, isClosed: boolean) => {
      setCurrentChangelog(isClosed ? version : '');
    };

  React.useEffect(() => {
    if (changelogs.length < 1) {
      setLoading(true);
      PanthorService.getChangelogs()
        .then(setChangelogs)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, []);

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} xl={9}>
          {loading ? (
            <Progress />
          ) : changelogs.length > 0 ? (
            changelogs.slice(0, 30).map((changelog) => (
              <Accordion
                key={`${id}-changelog-${changelog.id}`}
                expanded={currentChangelog === changelog.version}
                onChange={handleChange(changelog.version)}
              >
                <AccordionSummary
                  expanded={currentChangelog === changelog.version}
                  expandIcon={<ExpandMoreIcon />}
                  id={`panel${changelog.id}a-header`}
                >
                  <Typography sx={{ width: { xs: '100%', md: 'unset' } }}>
                    Changelog {changelog.version} - {format(changelog.releaseAt, 'dd.MM.yy')}
                  </Typography>
                  {changelog.size ? (
                    <Chip label={changelog.size} size="small" sx={{ ml: { xs: 0, md: 1 } }} />
                  ) : null}
                  <Chip
                    icon={changelog.hasModChange() ? <CheckIcon /> : <CloseIcon />}
                    label="Mod änderungen"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  {changelog.changeMission.length > 0 && (
                    <React.Fragment>
                      <Typography variant="subtitle1">Mission</Typography>
                      <ul>
                        {changelog.changeMission.map((change) => (
                          <li>{change}</li>
                        ))}
                      </ul>
                    </React.Fragment>
                  )}

                  {changelog.changeMod.length > 0 && (
                    <React.Fragment>
                      <Typography variant="subtitle1">Mod</Typography>
                      <ul>
                        {changelog.changeMod.map((change) => (
                          <li>{change}</li>
                        ))}
                      </ul>
                    </React.Fragment>
                  )}

                  {changelog.changeMap.length > 0 && (
                    <React.Fragment>
                      <Typography variant="subtitle1">Karte</Typography>
                      <ul>
                        {changelog.changeMap.map((change) => (
                          <li>{change}</li>
                        ))}
                      </ul>
                    </React.Fragment>
                  )}
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <NoItems message="Keine Changelogs vorhanden" />
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
