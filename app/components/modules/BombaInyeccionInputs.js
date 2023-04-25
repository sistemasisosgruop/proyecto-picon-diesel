import { Group, GroupInputsBomba } from "../elements/Form"
import { Input } from "@material-tailwind/react"

const LateralText = ({texto}) => {
    return (
        <div className="w-[68px] flex items-center mr-2">
            <p className="w-[68px] text-left text-black text-sm font-bold overflow-hidden">
            {texto}
        </p>
        </div>
        
    )
}

const InputBomba = ({hidden = false, value, onchange }) => {
    return (
        <Input 
            size="md" 
            className="w-44" 
            labelProps={{style: {width: "11rem"}}} 
            value={value}
            onChange = {e => onchange(e)}
            hidden={hidden}
        />
    )
}

const ContainerInputsGroup = ({children}) => {
    return (
        <div className="flex flex-col gap-2">
            {children}
        </div>
    )
}

const HeadersInputs = () => {
    return (
        <div className="flex w-full bg-blue-gray-200 text-black font-bold text-base rounded-t-lg gap-16 pr-10">
            <h3 className="p-2">Prueba</h3>
            <h3 className="py-2 text-center">RPM Tabla</h3>
            <h3 className="py-2 text-center ml-7">Rango Tabla</h3>
            <h3 className="py-2 text-center ml-8">Eval. Inicial</h3>
            <h3 className="py-2 text-center ml-8">Result. Final</h3>
        </div>
    )
}


export const BombaInyeccionInputs = ({bombaInyeccionInputs, setBombaInyeccionInputs}) => {
  return (
    <Group title={""}>
        <HeadersInputs/>
        <GroupInputsBomba>
            <LateralText texto={"Mínimo - RPM"}/>
            <InputBomba
                value={bombaInyeccionInputs?.minimoRpm.rpmTabla}
                onchange={(e) => {
                    setBombaInyeccionInputs(prevState => ({
                        ...prevState,
                        minimoRpm: {
                          ...prevState.minimoRpm,
                          rpmTabla: e.target.value
                        }
                    }));
                }}
            />
            <InputBomba 
                value={bombaInyeccionInputs?.minimoRpm.rangoTabla}
                onchange={(e) => {
                    setBombaInyeccionInputs(prevState => ({
                        ...prevState,
                        minimoRpm: {
                          ...prevState.minimoRpm,
                          rangoTabla: e.target.value
                        }
                    }));
                }}
            />
            <InputBomba 
                value={bombaInyeccionInputs?.minimoRpm.evalInicial}
                onchange={(e) => {
                    setBombaInyeccionInputs(prevState => ({
                        ...prevState,
                        minimoRpm: {
                          ...prevState.minimoRpm,
                          evalInicial: e.target.value
                        }
                    }));
                }}
            />
            <InputBomba 
                value={bombaInyeccionInputs?.minimoRpm.resFinal}
                onchange={(e) => {
                    setBombaInyeccionInputs(prevState => ({
                        ...prevState,
                        minimoRpm: {
                          ...prevState.minimoRpm,
                          resFinal: e.target.value
                        }
                    }));
                }}
            />
        </GroupInputsBomba>
        <GroupInputsBomba>
            <LateralText texto={"C. arranque - cm3"}/>
            <InputBomba 
                value={bombaInyeccionInputs?.cArranque.rpmTabla}
                onchange={(e) => {
                    setBombaInyeccionInputs(prevState => ({
                        ...prevState,
                        cArranque: {
                          ...prevState.cArranque,
                          rpmTabla: e.target.value
                        }
                    }));
                }}
            />
            <InputBomba 
                value={bombaInyeccionInputs?.cArranque.rangoTabla}
                onchange={(e) => {
                    setBombaInyeccionInputs(prevState => ({
                        ...prevState,
                        cArranque: {
                          ...prevState.cArranque,
                          rangoTabla: e.target.value
                        }
                    }));
                }}
            />
            <InputBomba 
                value={bombaInyeccionInputs?.cArranque.evalInicial}
                onchange={(e) => {
                    setBombaInyeccionInputs(prevState => ({
                        ...prevState,
                        cArranque: {
                          ...prevState.cArranque,
                          evalInicial: e.target.value
                        }
                    }));
                }}
            />
            <InputBomba
                value={bombaInyeccionInputs?.cArranque.resFinal}
                onchange={(e) => {
                    setBombaInyeccionInputs(prevState => ({
                        ...prevState,
                        cArranque: {
                          ...prevState.cArranque,
                          resFinal: e.target.value
                        }
                    }));
                }}
            />
        </GroupInputsBomba>
        <GroupInputsBomba>
            <LateralText texto={"Caudal máximo con carga - cm3"}/>
            <InputBomba 
                value={bombaInyeccionInputs?.caudalMaximoCon.rpmTabla}
                onchange={(e) => {
                    setBombaInyeccionInputs(prevState => ({
                        ...prevState,
                        caudalMaximoCon: {
                          ...prevState.caudalMaximoCon,
                          rpmTabla: e.target.value
                        }
                    }));
                }}
            />
            <ContainerInputsGroup>
                <InputBomba 
                    value={bombaInyeccionInputs?.caudalMaximoCon.rangoTabla.rangoTabla1}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            caudalMaximoCon: {
                              ...prevState.caudalMaximoCon,
                              rangoTabla: {
                                ...prevState.caudalMaximoCon.rangoTabla,
                                rangoTabla1: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.caudalMaximoCon.rangoTabla.rangoTabla2}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            caudalMaximoCon: {
                              ...prevState.caudalMaximoCon,
                              rangoTabla: {
                                ...prevState.caudalMaximoCon.rangoTabla,
                                rangoTabla2: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.caudalMaximoCon.rangoTabla.rangoTabla3}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            caudalMaximoCon: {
                              ...prevState.caudalMaximoCon,
                              rangoTabla: {
                                ...prevState.caudalMaximoCon.rangoTabla,
                                rangoTabla3: e.target.value
                              }
                            }
                          }));
                    }}
                />
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputBomba 
                    value={bombaInyeccionInputs?.caudalMaximoCon.evalInicial.evalInicial1}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            caudalMaximoCon: {
                              ...prevState.caudalMaximoCon,
                              evalInicial: {
                                ...prevState.caudalMaximoCon.evalInicial,
                                evalInicial1: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.caudalMaximoCon.evalInicial.evalInicial2}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            caudalMaximoCon: {
                              ...prevState.caudalMaximoCon,
                              evalInicial: {
                                ...prevState.caudalMaximoCon.evalInicial,
                                evalInicial2: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.caudalMaximoCon.evalInicial.evalInicial3}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            caudalMaximoCon: {
                              ...prevState.caudalMaximoCon,
                              evalInicial: {
                                ...prevState.caudalMaximoCon.evalInicial,
                                evalInicial3: e.target.value
                              }
                            }
                          }));
                    }}
                />
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputBomba 
                    value={bombaInyeccionInputs?.caudalMaximoCon.resFinal.resFinal1}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            caudalMaximoCon: {
                              ...prevState.caudalMaximoCon,
                              resFinal: {
                                ...prevState.caudalMaximoCon.resFinal,
                                resFinal1: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.caudalMaximoCon.resFinal.resFinal2}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            caudalMaximoCon: {
                              ...prevState.caudalMaximoCon,
                              resFinal: {
                                ...prevState.caudalMaximoCon.resFinal,
                                resFinal2: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.caudalMaximoCon.resFinal.resFinal3}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            caudalMaximoCon: {
                              ...prevState.caudalMaximoCon,
                              resFinal: {
                                ...prevState.caudalMaximoCon.resFinal,
                                resFinal3: e.target.value
                              }
                            }
                          }));
                    }}
                />
            </ContainerInputsGroup>
            
        </GroupInputsBomba>

        <GroupInputsBomba>
            <LateralText texto={"Caudal máximo sin carga - cm3"}/>
            <InputBomba 
                value={bombaInyeccionInputs?.caudalMaximoSin.rpmTabla}
                onchange={(e) => {
                    setBombaInyeccionInputs(prevState => ({
                        ...prevState,
                        caudalMaximoSin: {
                          ...prevState.caudalMaximoSin,
                          rpmTabla: e.target.value
                        }
                    }));
                }}
            />
            <ContainerInputsGroup>
                <InputBomba 
                    value={bombaInyeccionInputs?.caudalMaximoSin.rangoTabla.rangoTabla1}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            caudalMaximoSin: {
                              ...prevState.caudalMaximoSin,
                              rangoTabla: {
                                ...prevState.caudalMaximoSin.rangoTabla,
                                rangoTabla1: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.caudalMaximoSin.rangoTabla.rangoTabla2}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            caudalMaximoSin: {
                              ...prevState.caudalMaximoSin,
                              rangoTabla: {
                                ...prevState.caudalMaximoSin.rangoTabla,
                                rangoTabla2: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.caudalMaximoSin.rangoTabla.rangoTabla3}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            caudalMaximoSin: {
                              ...prevState.caudalMaximoSin,
                              rangoTabla: {
                                ...prevState.caudalMaximoSin.rangoTabla,
                                rangoTabla3: e.target.value
                              }
                            }
                          }));
                    }}
                />
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputBomba 
                    value={bombaInyeccionInputs?.caudalMaximoSin.evalInicial.evalInicial1}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            caudalMaximoSin: {
                              ...prevState.caudalMaximoSin,
                              evalInicial: {
                                ...prevState.caudalMaximoSin.evalInicial,
                                evalInicial1: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.caudalMaximoSin.evalInicial.evalInicial2}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            caudalMaximoSin: {
                              ...prevState.caudalMaximoSin,
                              evalInicial: {
                                ...prevState.caudalMaximoSin.evalInicial,
                                evalInicial2: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.caudalMaximoSin.evalInicial.evalInicial3}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            caudalMaximoSin: {
                              ...prevState.caudalMaximoSin,
                              evalInicial: {
                                ...prevState.caudalMaximoSin.evalInicial,
                                evalInicial3: e.target.value
                              }
                            }
                          }));
                    }}
                />
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputBomba 
                    value={bombaInyeccionInputs?.caudalMaximoSin.resFinal.resFinal1}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            caudalMaximoSin: {
                              ...prevState.caudalMaximoSin,
                              resFinal: {
                                ...prevState.caudalMaximoSin.resFinal,
                                resFinal1: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.caudalMaximoSin.resFinal.resFinal2}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            caudalMaximoSin: {
                              ...prevState.caudalMaximoSin,
                              resFinal: {
                                ...prevState.caudalMaximoSin.resFinal,
                                resFinal2: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.caudalMaximoSin.resFinal.resFinal3}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            caudalMaximoSin: {
                              ...prevState.caudalMaximoSin,
                              resFinal: {
                                ...prevState.caudalMaximoSin.resFinal,
                                resFinal3: e.target.value
                              }
                            }
                          }));
                    }}
                />
            </ContainerInputsGroup>
            
        </GroupInputsBomba>

        <GroupInputsBomba>
            <LateralText texto={"Presión bomba transferenci - Bar"}/>
            <InputBomba 
                value={bombaInyeccionInputs?.presionBomba.rpmTabla}
                onchange={(e) => {
                    setBombaInyeccionInputs(prevState => ({
                        ...prevState,
                        presionBomba: {
                          ...prevState.presionBomba,
                          rpmTabla: e.target.value
                        }
                    }));
                }}
            />
            <ContainerInputsGroup>
                <InputBomba 
                    value={bombaInyeccionInputs?.presionBomba.rangoTabla.rangoTabla1}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            presionBomba: {
                              ...prevState.presionBomba,
                              rangoTabla: {
                                ...prevState.presionBomba.rangoTabla,
                                rangoTabla1: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.presionBomba.rangoTabla.rangoTabla2}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            presionBomba: {
                              ...prevState.presionBomba,
                              rangoTabla: {
                                ...prevState.presionBomba.rangoTabla,
                                rangoTabla2: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.presionBomba.rangoTabla.rangoTabla3}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            presionBomba: {
                              ...prevState.presionBomba,
                              rangoTabla: {
                                ...prevState.presionBomba.rangoTabla,
                                rangoTabla3: e.target.value
                              }
                            }
                          }));
                    }}
                />
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputBomba 
                    value={bombaInyeccionInputs?.presionBomba.evalInicial.evalInicial1}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            presionBomba: {
                              ...prevState.presionBomba,
                              evalInicial: {
                                ...prevState.presionBomba.evalInicial,
                                evalInicial1: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.presionBomba.evalInicial.evalInicial2}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            presionBomba: {
                              ...prevState.presionBomba,
                              evalInicial: {
                                ...prevState.presionBomba.evalInicial,
                                evalInicial2: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.presionBomba.evalInicial.evalInicial3}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            presionBomba: {
                              ...prevState.presionBomba,
                              evalInicial: {
                                ...prevState.presionBomba.evalInicial,
                                evalInicial3: e.target.value
                              }
                            }
                          }));
                    }}
                />
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputBomba 
                    value={bombaInyeccionInputs?.presionBomba.resFinal.resFinal1}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            presionBomba: {
                              ...prevState.presionBomba,
                              resFinal: {
                                ...prevState.presionBomba.resFinal,
                                resFinal1: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.presionBomba.resFinal.resFinal2}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            presionBomba: {
                              ...prevState.presionBomba,
                              resFinal: {
                                ...prevState.presionBomba.resFinal,
                                resFinal2: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.presionBomba.resFinal.resFinal3}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            presionBomba: {
                              ...prevState.presionBomba,
                              resFinal: {
                                ...prevState.presionBomba.resFinal,
                                resFinal3: e.target.value
                              }
                            }
                          }));
                    }}
                />
            </ContainerInputsGroup>
            
        </GroupInputsBomba>

        <GroupInputsBomba>
            <LateralText texto={"Recorrido variador avance - mm"}/>
            <InputBomba 
                value={bombaInyeccionInputs?.RecorridoVariador.rpmTabla}
                onchange={(e) => {
                    setBombaInyeccionInputs(prevState => ({
                        ...prevState,
                        RecorridoVariador: {
                          ...prevState.RecorridoVariador,
                          rpmTabla: e.target.value
                        }
                    }));
                }}
            />
            <ContainerInputsGroup>
                <InputBomba 
                    value={bombaInyeccionInputs?.RecorridoVariador.rangoTabla.rangoTabla1}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            RecorridoVariador: {
                              ...prevState.RecorridoVariador,
                              rangoTabla: {
                                ...prevState.RecorridoVariador.rangoTabla,
                                rangoTabla1: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.RecorridoVariador.rangoTabla.rangoTabla2}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            RecorridoVariador: {
                              ...prevState.RecorridoVariador,
                              rangoTabla: {
                                ...prevState.RecorridoVariador.rangoTabla,
                                rangoTabla2: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.RecorridoVariador.rangoTabla.rangoTabla3}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            RecorridoVariador: {
                              ...prevState.RecorridoVariador,
                              rangoTabla: {
                                ...prevState.RecorridoVariador.rangoTabla,
                                rangoTabla3: e.target.value
                              }
                            }
                          }));
                    }}
                />
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputBomba 
                    value={bombaInyeccionInputs?.RecorridoVariador.evalInicial.evalInicial1}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            RecorridoVariador: {
                              ...prevState.RecorridoVariador,
                              evalInicial: {
                                ...prevState.RecorridoVariador.evalInicial,
                                evalInicial1: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.RecorridoVariador.evalInicial.evalInicial2}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            RecorridoVariador: {
                              ...prevState.RecorridoVariador,
                              evalInicial: {
                                ...prevState.RecorridoVariador.evalInicial,
                                evalInicial2: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.RecorridoVariador.evalInicial.evalInicial3}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            RecorridoVariador: {
                              ...prevState.RecorridoVariador,
                              evalInicial: {
                                ...prevState.RecorridoVariador.evalInicial,
                                evalInicial3: e.target.value
                              }
                            }
                          }));
                    }}
                />
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputBomba 
                    value={bombaInyeccionInputs?.RecorridoVariador.resFinal.resFinal1}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            RecorridoVariador: {
                              ...prevState.RecorridoVariador,
                              resFinal: {
                                ...prevState.RecorridoVariador.resFinal,
                                resFinal1: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.RecorridoVariador.resFinal.resFinal2}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            RecorridoVariador: {
                              ...prevState.RecorridoVariador,
                              resFinal: {
                                ...prevState.RecorridoVariador.resFinal,
                                resFinal2: e.target.value
                              }
                            }
                          }));
                    }}
                />
                <InputBomba 
                    value={bombaInyeccionInputs?.RecorridoVariador.resFinal.resFinal3}
                    onchange={(e)=> {
                        setBombaInyeccionInputs(prevState => ({
                            ...prevState,
                            RecorridoVariador: {
                              ...prevState.RecorridoVariador,
                              resFinal: {
                                ...prevState.RecorridoVariador.resFinal,
                                resFinal3: e.target.value
                              }
                            }
                          }));
                    }}
                />
            </ContainerInputsGroup>
            
        </GroupInputsBomba>

        <GroupInputsBomba>
            <LateralText texto={"Corte min - RPM"}/>
            <InputBomba
                value={bombaInyeccionInputs?.corteMin.rpmTabla}
                onchange={(e) => {
                    setBombaInyeccionInputs(prevState => ({
                        ...prevState,
                        corteMin: {
                          ...prevState.corteMin,
                          rpmTabla: e.target.value
                        }
                    }));
                }}
            />
            <InputBomba 
                value={bombaInyeccionInputs?.corteMin.rangoTabla}
                onchange={(e) => {
                    setBombaInyeccionInputs(prevState => ({
                        ...prevState,
                        corteMin: {
                          ...prevState.corteMin,
                          rangoTabla: e.target.value
                        }
                    }));
                }}
            />
            <InputBomba 
                value={bombaInyeccionInputs?.corteMin.evalInicial}
                onchange={(e) => {
                    setBombaInyeccionInputs(prevState => ({
                        ...prevState,
                        corteMin: {
                          ...prevState.corteMin,
                          evalInicial: e.target.value
                        }
                    }));
                }}
            />
            <InputBomba 
                value={bombaInyeccionInputs?.corteMin.resFinal}
                onchange={(e) => {
                    setBombaInyeccionInputs(prevState => ({
                        ...prevState,
                        corteMin: {
                          ...prevState.corteMin,
                          resFinal: e.target.value
                        }
                    }));
                }}
            />
        </GroupInputsBomba>
        <GroupInputsBomba>
            <LateralText texto={"Corte max - RPM"}/>
            <InputBomba
                value={bombaInyeccionInputs?.corteMax.rpmTabla}
                onchange={(e) => {
                    setBombaInyeccionInputs(prevState => ({
                        ...prevState,
                        corteMax: {
                          ...prevState.corteMax,
                          rpmTabla: e.target.value
                        }
                    }));
                }}
            />
            <InputBomba 
                value={bombaInyeccionInputs?.corteMax.rangoTabla}
                onchange={(e) => {
                    setBombaInyeccionInputs(prevState => ({
                        ...prevState,
                        corteMax: {
                          ...prevState.corteMax,
                          rangoTabla: e.target.value
                        }
                    }));
                }}
            />
            <InputBomba 
                value={bombaInyeccionInputs?.corteMax.evalInicial}
                onchange={(e) => {
                    setBombaInyeccionInputs(prevState => ({
                        ...prevState,
                        corteMax: {
                          ...prevState.corteMax,
                          evalInicial: e.target.value
                        }
                    }));
                }}
            />
            <InputBomba 
                value={bombaInyeccionInputs?.corteMax.resFinal}
                onchange={(e) => {
                    setBombaInyeccionInputs(prevState => ({
                        ...prevState,
                        corteMax: {
                          ...prevState.corteMax,
                          resFinal: e.target.value
                        }
                    }));
                }}
            />
        </GroupInputsBomba>
    </Group>
  )
}
