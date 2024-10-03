import { Group, GroupInputsBomba } from "../elements/Form"
import { Input } from "@material-tailwind/react"

export const InyectorElectronicoInputs = ({inyectorElectronicoInputs, setInyectorElectronicoInputs}) => {

    const LateralText = ({texto}) => {
        return (
            <div className="w-[68px] flex items-center mr-2">
                <p className="w-[68px] text-left text-black text-sm font-bold overflow-hidden break-words">
                {texto}
            </p>
            </div>
            
        )
    }
    
    const InputElectronico = ({hidden = false, value, onchange}) => {
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

    const HeadersInputs = () => {
        return (
            <div className="flex w-full bg-blue-gray-200 text-black font-bold text-base rounded-t-lg gap-8">
                <h3 className="p-2">Prueba</h3>
                <h3 className="py-2 text-center">Inyector 1</h3>
                <h3 className="py-2 text-center ml-3">Inyector 2</h3>
                <h3 className="py-2 text-center ml-3">Inyector 3</h3>
                <h3 className="py-2 text-center ml-3">Inyector 4</h3>
                <h3 className="py-2 text-center ml-3">Inyector 5</h3>
                <h3 className="py-2 text-center ml-3">Inyector 6</h3>
            </div>
        )
    }

    return (
        <Group title={""}>
            <HeadersInputs/>
            <GroupInputsBomba>
                <LateralText texto={"Backflow"}/>
                <InputElectronico
                    value={inyectorElectronicoInputs?.backflow.inyector1}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            backflow: {
                              ...prevState.backflow,
                              inyector1: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.backflow.inyector2}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            backflow: {
                              ...prevState.backflow,
                              inyector2: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.backflow.inyector3}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            backflow: {
                              ...prevState.backflow,
                              inyector3: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.backflow.inyector4}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            backflow: {
                              ...prevState.backflow,
                              inyector4: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.backflow.inyector5}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            backflow: {
                              ...prevState.backflow,
                              inyector5: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.backflow.inyector6}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            backflow: {
                              ...prevState.backflow,
                              inyector6: e.target.value
                            }
                        }));
                    }}
                />
            </GroupInputsBomba>

            <GroupInputsBomba>
                <LateralText texto={"Backflow 2"}/>
                <InputElectronico
                    value={inyectorElectronicoInputs?.backflow2.inyector1}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            backflow2: {
                              ...prevState.backflow2,
                              inyector1: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.backflow2.inyector2}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            backflow2: {
                              ...prevState.backflow2,
                              inyector2: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.backflow2.inyector3}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            backflow2: {
                              ...prevState.backflow2,
                              inyector3: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.backflow2.inyector4}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            backflow2: {
                              ...prevState.backflow2,
                              inyector4: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.backflow2.inyector5}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            backflow2: {
                              ...prevState.backflow2,
                              inyector5: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.backflow2.inyector6}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            backflow2: {
                              ...prevState.backflow2,
                              inyector6: e.target.value
                            }
                        }));
                    }}
                />
            </GroupInputsBomba>

            <GroupInputsBomba>
                <LateralText texto={"Maximum value"}/>
                <InputElectronico
                    value={inyectorElectronicoInputs?.maximumValue.inyector1}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            maximumValue: {
                              ...prevState.maximumValue,
                              inyector1: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.maximumValue.inyector2}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            maximumValue: {
                              ...prevState.maximumValue,
                              inyector2: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.maximumValue.inyector3}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            maximumValue: {
                              ...prevState.maximumValue,
                              inyector3: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.maximumValue.inyector4}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            maximumValue: {
                              ...prevState.maximumValue,
                              inyector4: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.maximumValue.inyector5}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            maximumValue: {
                              ...prevState.maximumValue,
                              inyector5: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.maximumValue.inyector6}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            maximumValue: {
                              ...prevState.maximumValue,
                              inyector6: e.target.value
                            }
                        }));
                    }}
                />
            </GroupInputsBomba>

            <GroupInputsBomba>
                <LateralText texto={"Medium value"}/>
                <InputElectronico
                    value={inyectorElectronicoInputs?.mediumValue.inyector1}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            mediumValue: {
                              ...prevState.mediumValue,
                              inyector1: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.mediumValue.inyector2}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            mediumValue: {
                              ...prevState.mediumValue,
                              inyector2: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.mediumValue.inyector3}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            mediumValue: {
                              ...prevState.mediumValue,
                              inyector3: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.mediumValue.inyector4}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            mediumValue: {
                              ...prevState.mediumValue,
                              inyector4: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.mediumValue.inyector5}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            mediumValue: {
                              ...prevState.mediumValue,
                              inyector5: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.mediumValue.inyector6}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            mediumValue: {
                              ...prevState.mediumValue,
                              inyector6: e.target.value
                            }
                        }));
                    }}
                />
            </GroupInputsBomba>

            <GroupInputsBomba>
                <LateralText texto={"Lowspeed"}/>
                <InputElectronico
                    value={inyectorElectronicoInputs?.lowspeed.inyector1}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            lowspeed: {
                              ...prevState.lowspeed,
                              inyector1: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.lowspeed.inyector2}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            lowspeed: {
                              ...prevState.lowspeed,
                              inyector2: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.lowspeed.inyector3}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            lowspeed: {
                              ...prevState.lowspeed,
                              inyector3: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.lowspeed.inyector4}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            lowspeed: {
                              ...prevState.lowspeed,
                              inyector4: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.lowspeed.inyector5}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            lowspeed: {
                              ...prevState.lowspeed,
                              inyector5: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.lowspeed.inyector6}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            lowspeed: {
                              ...prevState.lowspeed,
                              inyector6: e.target.value
                            }
                        }));
                    }}
                />
            </GroupInputsBomba>

            <GroupInputsBomba>
                <LateralText texto={"Preinjection"}/>
                <InputElectronico
                    value={inyectorElectronicoInputs?.preinjection.inyector1}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            preinjection: {
                              ...prevState.preinjection,
                              inyector1: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.preinjection.inyector2}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            preinjection: {
                              ...prevState.preinjection,
                              inyector2: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.preinjection.inyector3}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            preinjection: {
                              ...prevState.preinjection,
                              inyector3: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.preinjection.inyector4}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            preinjection: {
                              ...prevState.preinjection,
                              inyector4: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.preinjection.inyector5}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            preinjection: {
                              ...prevState.preinjection,
                              inyector5: e.target.value
                            }
                        }));
                    }}
                />
                <InputElectronico
                    value={inyectorElectronicoInputs?.preinjection.inyector6}
                    onchange={(e) => {
                        setInyectorElectronicoInputs(prevState => ({
                            ...prevState,
                            preinjection: {
                              ...prevState.preinjection,
                              inyector6: e.target.value
                            }
                        }));
                    }}
                />
            </GroupInputsBomba>
        </Group>
    )
}

