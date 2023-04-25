import { Group, GroupInputsBomba } from "../elements/Form"
import { Input } from "@material-tailwind/react"

const LateralText = ({texto}) => {
    return (
        <div className="w-[68px] flex items-center mr-2">
            <p className="w-[68px] text-left text-black text-sm font-bold overflow-hidden break-words">
            {texto}
        </p>
        </div>
        
    )
}

const TextSecond = ({texto1, texto2})  => {
    return (
        <div className="flex flex-col gap-8 justify-center items-center pt-2">
            <p className="w-[68px] text-left text-black text-sm font-bold overflow-hidden">
              {texto1}  
            </p>
            <p className="w-[68px] text-left text-black text-sm font-bold overflow-hidden">
                {texto2}
            </p>
        </div>
    )
}

const InputConvencional = ({hidden = false, value, onchange}) => {
    return (            
        
            <Input 
                className="w-24 ml-4" 
                labelProps={{style: {width: "6rem", marginLeft:"1rem"}}} 
                containerProps={{style: {minWidth: "6rem"}}}
                value={value}
                onChange = {e => onchange(e)}
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
        <div className="flex w-full bg-blue-gray-200 text-black font-bold text-base rounded-t-lg gap-5">
            <h3 className="p-2 mr-20">Prueba</h3>
            <h3 className="py-2 text-center ml-3">Inyector 1</h3>
            <h3 className="py-2 text-center ml-3">Inyector 2</h3>
            <h3 className="py-2 text-center ml-3">Inyector 3</h3>
            <h3 className="py-2 text-center ml-3">Inyector 4</h3>
            <h3 className="py-2 text-center ml-3">Inyector 5</h3>
            <h3 className="py-2 text-center ml-3">Inyector 6</h3>
        </div>
    )
}

export const InyectorConvencional = ({inyectorConvencional, setInyectorConvencional}) => {
  return (
    <Group title={""}>
        <HeadersInputs/>
        <GroupInputsBomba>
            <LateralText texto={"Backflow"}/>
            <ContainerInputsGroup>
                <TextSecond texto1={"Eval. I"} texto2={"Result. F"}/>
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.backflow.eval.inyector1}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            backflow: {
                              ...prevState.backflow,
                              eval: {
                                ...prevState.backflow.eval,
                                inyector1: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.backflow.res.inyector1}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            backflow: {
                              ...prevState.backflow,
                              res: {
                                ...prevState.backflow.res,
                                inyector1: e.target.value
                              }
                            }
                          }));
                    }}
                />             
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.backflow.eval.inyector2}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            backflow: {
                              ...prevState.backflow,
                              eval: {
                                ...prevState.backflow.eval,
                                inyector2: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.backflow.res.inyector2}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            backflow: {
                              ...prevState.backflow,
                              res: {
                                ...prevState.backflow.res,
                                inyector2: e.target.value
                              }
                            }
                          }));
                    }}
                />      
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.backflow.eval.inyector3}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            backflow: {
                              ...prevState.backflow,
                              eval: {
                                ...prevState.backflow.eval,
                                inyector3: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.backflow.res.inyector3}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            backflow: {
                              ...prevState.backflow,
                              res: {
                                ...prevState.backflow.res,
                                inyector3: e.target.value
                              }
                            }
                          }));
                    }}
                />      
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.backflow.eval.inyector4}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            backflow: {
                              ...prevState.backflow,
                              eval: {
                                ...prevState.backflow.eval,
                                inyector4: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.backflow.res.inyector4}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            backflow: {
                              ...prevState.backflow,
                              res: {
                                ...prevState.backflow.res,
                                inyector4: e.target.value
                              }
                            }
                          }));
                    }}
                /> 
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.backflow.eval.inyector5}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            backflow: {
                              ...prevState.backflow,
                              eval: {
                                ...prevState.backflow.eval,
                                inyector5: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.backflow.res.inyector5}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            backflow: {
                              ...prevState.backflow,
                              res: {
                                ...prevState.backflow.res,
                                inyector5: e.target.value
                              }
                            }
                          }));
                    }}
                /> 
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.backflow.eval.inyector6}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            backflow: {
                              ...prevState.backflow,
                              eval: {
                                ...prevState.backflow.eval,
                                inyector6: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.backflow.res.inyector6}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            backflow: {
                              ...prevState.backflow,
                              res: {
                                ...prevState.backflow.res,
                                inyector6: e.target.value
                              }
                            }
                          }));
                    }}
                /> 
            </ContainerInputsGroup>

        </GroupInputsBomba>

        <GroupInputsBomba>
            <LateralText texto={"Pulverizado"}/>
            <ContainerInputsGroup>
                <TextSecond texto1={"Eval. I"} texto2={"Result. F"}/>
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.pulverizado.eval.inyector1}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            pulverizado: {
                              ...prevState.pulverizado,
                              eval: {
                                ...prevState.pulverizado.eval,
                                inyector1: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.pulverizado.res.inyector1}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            pulverizado: {
                              ...prevState.pulverizado,
                              res: {
                                ...prevState.pulverizado.res,
                                inyector1: e.target.value
                              }
                            }
                          }));
                    }}
                />             
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.pulverizado.eval.inyector2}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            pulverizado: {
                              ...prevState.pulverizado,
                              eval: {
                                ...prevState.pulverizado.eval,
                                inyector2: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.pulverizado.res.inyector2}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            pulverizado: {
                              ...prevState.pulverizado,
                              res: {
                                ...prevState.pulverizado.res,
                                inyector2: e.target.value
                              }
                            }
                          }));
                    }}
                />      
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.pulverizado.eval.inyector3}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            pulverizado: {
                              ...prevState.pulverizado,
                              eval: {
                                ...prevState.pulverizado.eval,
                                inyector3: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.pulverizado.res.inyector3}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            pulverizado: {
                              ...prevState.pulverizado,
                              res: {
                                ...prevState.pulverizado.res,
                                inyector3: e.target.value
                              }
                            }
                          }));
                    }}
                />      
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.pulverizado.eval.inyector4}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            pulverizado: {
                              ...prevState.pulverizado,
                              eval: {
                                ...prevState.pulverizado.eval,
                                inyector4: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.pulverizado.res.inyector4}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            pulverizado: {
                              ...prevState.pulverizado,
                              res: {
                                ...prevState.pulverizado.res,
                                inyector4: e.target.value
                              }
                            }
                          }));
                    }}
                /> 
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.pulverizado.eval.inyector5}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            pulverizado: {
                              ...prevState.pulverizado,
                              eval: {
                                ...prevState.pulverizado.eval,
                                inyector5: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.pulverizado.res.inyector5}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            pulverizado: {
                              ...prevState.pulverizado,
                              res: {
                                ...prevState.pulverizado.res,
                                inyector5: e.target.value
                              }
                            }
                          }));
                    }}
                /> 
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.pulverizado.eval.inyector6}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            pulverizado: {
                              ...prevState.pulverizado,
                              eval: {
                                ...prevState.pulverizado.eval,
                                inyector6: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.pulverizado.res.inyector6}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            pulverizado: {
                              ...prevState.pulverizado,
                              res: {
                                ...prevState.pulverizado.res,
                                inyector6: e.target.value
                              }
                            }
                          }));
                    }}
                /> 
            </ContainerInputsGroup>
        </GroupInputsBomba>

        <GroupInputsBomba>
            <LateralText texto={"Goteo"}/>
            <ContainerInputsGroup>
                <TextSecond texto1={"Eval. I"} texto2={"Result. F"}/>
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.goteo.eval.inyector1}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            goteo: {
                              ...prevState.goteo,
                              eval: {
                                ...prevState.goteo.eval,
                                inyector1: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.goteo.res.inyector1}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            goteo: {
                              ...prevState.goteo,
                              res: {
                                ...prevState.goteo.res,
                                inyector1: e.target.value
                              }
                            }
                          }));
                    }}
                />             
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.goteo.eval.inyector2}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            goteo: {
                              ...prevState.goteo,
                              eval: {
                                ...prevState.goteo.eval,
                                inyector2: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.goteo.res.inyector2}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            goteo: {
                              ...prevState.goteo,
                              res: {
                                ...prevState.goteo.res,
                                inyector2: e.target.value
                              }
                            }
                          }));
                    }}
                />      
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.goteo.eval.inyector3}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            goteo: {
                              ...prevState.goteo,
                              eval: {
                                ...prevState.goteo.eval,
                                inyector3: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.goteo.res.inyector3}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            goteo: {
                              ...prevState.goteo,
                              res: {
                                ...prevState.goteo.res,
                                inyector3: e.target.value
                              }
                            }
                          }));
                    }}
                />      
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.goteo.eval.inyector4}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            goteo: {
                              ...prevState.goteo,
                              eval: {
                                ...prevState.goteo.eval,
                                inyector4: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.goteo.res.inyector4}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            goteo: {
                              ...prevState.goteo,
                              res: {
                                ...prevState.goteo.res,
                                inyector4: e.target.value
                              }
                            }
                          }));
                    }}
                /> 
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.goteo.eval.inyector5}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            goteo: {
                              ...prevState.goteo,
                              eval: {
                                ...prevState.goteo.eval,
                                inyector5: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.goteo.res.inyector5}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            goteo: {
                              ...prevState.goteo,
                              res: {
                                ...prevState.goteo.res,
                                inyector5: e.target.value
                              }
                            }
                          }));
                    }}
                /> 
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.goteo.eval.inyector6}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            goteo: {
                              ...prevState.goteo,
                              eval: {
                                ...prevState.goteo.eval,
                                inyector6: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.goteo.res.inyector6}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            goteo: {
                              ...prevState.goteo,
                              res: {
                                ...prevState.goteo.res,
                                inyector6: e.target.value
                              }
                            }
                          }));
                    }}
                /> 
            </ContainerInputsGroup>

        </GroupInputsBomba>


        <GroupInputsBomba>
            <LateralText texto={"Caída"}/>
            <ContainerInputsGroup>
                <TextSecond texto1={"Eval. I"} texto2={"Result. F"}/>
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.caida.eval.inyector1}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            caida: {
                              ...prevState.caida,
                              eval: {
                                ...prevState.caida.eval,
                                inyector1: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.caida.res.inyector1}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            caida: {
                              ...prevState.caida,
                              res: {
                                ...prevState.caida.res,
                                inyector1: e.target.value
                              }
                            }
                          }));
                    }}
                />             
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.caida.eval.inyector2}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            caida: {
                              ...prevState.caida,
                              eval: {
                                ...prevState.caida.eval,
                                inyector2: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.caida.res.inyector2}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            caida: {
                              ...prevState.caida,
                              res: {
                                ...prevState.caida.res,
                                inyector2: e.target.value
                              }
                            }
                          }));
                    }}
                />      
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.caida.eval.inyector3}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            caida: {
                              ...prevState.caida,
                              eval: {
                                ...prevState.caida.eval,
                                inyector3: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.caida.res.inyector3}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            caida: {
                              ...prevState.caida,
                              res: {
                                ...prevState.caida.res,
                                inyector3: e.target.value
                              }
                            }
                          }));
                    }}
                />      
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.caida.eval.inyector4}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            caida: {
                              ...prevState.caida,
                              eval: {
                                ...prevState.caida.eval,
                                inyector4: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.caida.res.inyector4}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            caida: {
                              ...prevState.caida,
                              res: {
                                ...prevState.caida.res,
                                inyector4: e.target.value
                              }
                            }
                          }));
                    }}
                /> 
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.caida.eval.inyector5}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            caida: {
                              ...prevState.caida,
                              eval: {
                                ...prevState.caida.eval,
                                inyector5: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.caida.res.inyector5}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            caida: {
                              ...prevState.caida,
                              res: {
                                ...prevState.caida.res,
                                inyector5: e.target.value
                              }
                            }
                          }));
                    }}
                /> 
            </ContainerInputsGroup>
            <ContainerInputsGroup>
                <InputConvencional
                    value={inyectorConvencional?.caida.eval.inyector6}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            caida: {
                              ...prevState.caida,
                              eval: {
                                ...prevState.caida.eval,
                                inyector6: e.target.value
                              }
                            }
                          }));
                    }}
                />                
                <InputConvencional
                    value={inyectorConvencional?.caida.res.inyector6}
                    onchange={(e) => {
                        setInyectorConvencional(prevState => ({
                            ...prevState,
                            caida: {
                              ...prevState.caida,
                              res: {
                                ...prevState.caida.res,
                                inyector6: e.target.value
                              }
                            }
                          }));
                    }}
                /> 
            </ContainerInputsGroup>

        </GroupInputsBomba>
        
    </Group>
  )
}
