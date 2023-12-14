import {GoMakeAutoComplate} from "@/components";
import Stack from "@mui/material/Stack";
import {MenuItem, Paper} from "@mui/material";
import {SecondaryCheckBox} from "@/components/check-box/secondary-check-box";
import React from "react";
import {useActionsMachines} from "@/widgets/production-floor-widget/hooks/use-actions-machines";
import {useTranslation} from "react-i18next";

const ActionsMachinesSelect = () => {
    const {actionsList, handleSelectStation, handelFilterActions} = useActionsMachines();
    const {t} = useTranslation();
  return(
      <GoMakeAutoComplate style={{width: '200px'}} options={actionsList}
                          onChangeTextField={(e) => handelFilterActions(e.target.value)}
                          placeholder={t('selectStation')}
                          renderOption={(props: any, option: typeof actionsList[0]) => {
                              return (
                                  <Stack>
                                      <MenuItem onClick={() => handleSelectStation(option.actionId)}>
                                          <SecondaryCheckBox checked={option.checked}/>
                                          <span>{option.actionName}</span>
                                      </MenuItem>
                                      <Stack direction={'row'} gap={'30px'}>
                                          <div/>
                                          <Stack>
                                              {
                                                  option.machines.map((machine) => <MenuItem onClick={() => handleSelectStation(machine.machineId)}>
                                                      <SecondaryCheckBox checked={machine.checked} />
                                                      {machine.machineName}
                                                  </MenuItem>)
                                              }
                                          </Stack>
                                      </Stack>
                                  </Stack>
                              );
                          }}
                          PaperComponent={(props) => {
                              return <Paper onClick={(e) => e.stopPropagation()} style={{
                                  width: 'fit-content',
                                  height: 'fit-content',
                                  maxHeight: '700px',
                                  overflow: 'auto'
                              }}>
                                  {
                                      props?.children
                                  }
                              </Paper>
                          }}/>
  )
}

export {ActionsMachinesSelect}