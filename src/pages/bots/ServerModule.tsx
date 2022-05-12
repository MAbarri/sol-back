import React, { useEffect, useState } from 'react';
import { instance } from '../../axios';
import { AppComponentProps } from '../../components/Route';
import { environment } from '../../environments/environment';
import { IonBackdrop, IonContent, IonLabel, IonToggle, useIonToast } from '@ionic/react';
import {
    Backdrop,
    CircularProgress,
    Grid,
    MenuItem,
    Select,
    Switch,
} from '@material-ui/core';
import './ServerModule.scss';
import { useLocation } from 'react-router';
import Loader from '../../components/Loader';

interface LocationParams {
    pathname: string;
    state: { server: Server };
    search: string;
    hash: string;
}
interface Server {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: string;
    features: [];
}

const ServerModule: React.FC<AppComponentProps> = () => {
    /**
     * States & Variables
     */
    const location: LocationParams = useLocation();
    const [isMobile, setIsMobile] = useState(false);
    const [checked, setChecked] = useState<{
        mintInfoModule: boolean;
        tokenModule: boolean;
    }>({
        mintInfoModule: false,
        tokenModule: false,
    });
    const [age, setAge] = React.useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [server, setServer] = useState<Server | null>(null);

    const [dropdownValue, setDropdownValue] = useState({
        dailyMintsWebhookChannel: '',
        oneHourMintInfoWebhookChannel: '',
        analyticsWebhookChannel: '',
    });
    const [channel, setChannel] = useState<any>(null);
    const [backdrop, setBackdrop] = useState(false);
    const [present, dismiss] = useIonToast();

    /**
     * Use Effects
     */
    useEffect(() => {
        if (window.innerWidth < 525) {
            setIsMobile(true);
        }
    }, [window.innerWidth]);
    // get guilds
    useEffect(() => {
        if (location) {
            if (location?.state?.server) {
                setIsLoading(true);
                let serverObj = location.state.server;
                setServer(serverObj);
                instance
                    .get(`/guilds/${serverObj.id}`)
                    .then((response) => {
                        let data = response.data.data;
                        setChecked({
                            ...checked,
                            mintInfoModule: data.mintInfoModule,
                            tokenModule: data.tokenModule,
                        });

                        setDropdownValue({
                            ...dropdownValue,
                            dailyMintsWebhookChannel:
                                data.dailyMintsWebhookChannel,
                            oneHourMintInfoWebhookChannel:
                                data.oneHourMintInfoWebhookChannel,
                            analyticsWebhookChannel:
                                data.analyticsWebhookChannel,
                        });
                        setChannel(data.textChannels);
                    })
                    .catch((error: any) => {
                        let msg = '';
                        if (error && error.response) {
                            msg = String(error.response.data.body);
                        } else {
                            msg = 'Unable to connect. Please try again later';
                        }
                        present({
                            message: msg,
                            color: 'danger',
                            duration: 5000,
                            buttons: [{ text: 'X', handler: () => dismiss() }],
                        });
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            }
        }
    }, [location]);

    // update guilds modules
    let enableModule = (obj: { module: string; enabled: boolean }) => {
        if (server) {
            setBackdrop(true);
            instance
                .post(`/guilds/${server.id}/modules`, obj, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(({ data }) => {
                    setChecked({ ...checked, [obj.module]: obj.enabled });
                })
                .catch((error:any) => {
                    console.log('error', error);
                    let msg = '';
                    if (error && error.response) {
                        msg = String(error.response.data.body);
                    } else {
                        msg = 'Unable to connect. Please try again later';
                    }
                    present({
                        message: msg,
                        color: 'danger',
                        duration: 5000,
                        buttons: [{ text: 'X', handler: () => dismiss() }],
                    });
                    
                })
                .finally(() => {
                    setIsLoading(false);
                    setBackdrop(false);
                });
        }
    };

    let updateWebHooks = (obj: { webhook: string; channel: string }) => {
        if (server) {
            setBackdrop(true);
            instance
                .post(`/guilds/${server.id}/webhooks`, obj, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(({ data }) => {
                    setDropdownValue({
                        ...dropdownValue,
                        [obj.webhook]: obj.channel,
                    });
                })
                .catch((error:any) => {
                    console.log('error', error);
                    let msg = '';
                    if (error && error.response) {
                        msg = String(error.response.data.body);
                    } else {
                        msg = 'Unable to connect. Please try again later';
                    }
                    present({
                        message: msg,
                        color: 'danger',
                        duration: 5000,
                        buttons: [{ text: 'X', handler: () => dismiss() }],
                    });
                })
                .finally(() => {
                    setIsLoading(false);
                    setBackdrop(false);
                });
        }
    };

    let getOption = () => {
        return channel?.map((obj: any, index: number) => {
            return (
                <option value={obj.id} key={index}>
                    {obj.name}
                </option>
            );
        });
    };

    if (isLoading) {
        return (
            <div className="pt-10 flex justify-center items-center">
                <Loader />
            </div>
        );
    }
    return (
        <>
            <Backdrop
                style={{
                    color: '#fff',
                    zIndex: 1000,
                }}
                open={backdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <IonLabel className="text-xl font-semibold  flex">
                Server Mangament
            </IonLabel>
            <div className="flex flex-row justify-center w-full mt-6">
                <Grid container spacing={4}>
                    {/*mintInfoModule  */}
                    <Grid item xs={12} md={6} xl={4}>
                        <div className="server-module-bg ">
                            <div className="flex flex-row justify-between w-full mt-6">
                                <div className="module-icon-wrapper ml-3">
                                    <img src={require('../../images/me.png')} />
                                </div>
                                <Switch
                                    checked={checked.mintInfoModule}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        enableModule({
                                            module: 'mintInfoModule',
                                            enabled: e.target.checked,
                                        });
                                    }}
                                />
                            </div>
                            <div className="flex flex-col mt-4">
                                <IonLabel className="ml-3 text-xl">
                                    MintInfo Module
                                </IonLabel>
                                <IonLabel className="ml-3 text-sm opacity-60 mt-2">
                                    Reactopn Roll detail
                                </IonLabel>
                            </div>
                        </div>
                    </Grid>
                    {/* tokenModule */}
                    <Grid item xs={12} md={6} xl={4}>
                        <div className="server-module-bg ">
                            <div className="flex flex-row justify-between w-full mt-6">
                                <div className="module-icon-wrapper ml-3">
                                    <img src={require('../../images/me.png')} />
                                </div>
                                <Switch
                                    checked={checked.tokenModule}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        enableModule({
                                            module: 'tokenModule',
                                            enabled: e.target.checked,
                                        });
                                    }}
                                />
                            </div>
                            <div className="flex flex-col mt-4">
                                <IonLabel className="ml-3 text-xl">
                                    Token Module
                                </IonLabel>
                                <IonLabel className="ml-3 text-sm opacity-60 mt-2">
                                    Reactopn Roll detail
                                </IonLabel>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>

            {/*  */}
            {checked.mintInfoModule && (
                <>
                    <IonLabel className="text-xl font-semibold flex mt-8 mb-8">
                        MintInfo Module
                    </IonLabel>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6} xl={6}>
                            <IonLabel className="text-base">
                                Daily Mints WebHook
                            </IonLabel>
                            <div className="flex flex-row justify-between ">
                                <select
                                    value={
                                        dropdownValue.dailyMintsWebhookChannel
                                    }
                                    className="server-channel-dropdown"
                                    onChange={(event: any) => {
                                        updateWebHooks({
                                            webhook: 'dailyMintsWebhookChannel',
                                            channel: event.target.value,
                                        });
                                    }}
                                >
                                    <option value="">
                                        Please Select DailyMintsWebhookChannel
                                    </option>
                                    {getOption()}
                                </select>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6} xl={6}>
                            <IonLabel className="text-base">
                                OneHour MintInfo WebHook
                            </IonLabel>
                            <div className="flex flex-row justify-between">
                                <select
                                    value={
                                        dropdownValue.oneHourMintInfoWebhookChannel
                                    }
                                    className="server-channel-dropdown"
                                    onChange={(event: any) => {
                                        updateWebHooks({
                                            webhook:
                                                'oneHourMintInfoWebhookChannel',
                                            channel: event.target.value,
                                        });
                                    }}
                                >
                                    <option value="">
                                        Please Select
                                        OneHourMintInfoWebhookChannel
                                    </option>
                                    {getOption()}
                                </select>
                            </div>
                        </Grid>
                    </Grid>
                </>
            )}
            {/*  */}

            {checked.tokenModule && (
                <>
                    <IonLabel className="text-xl font-semibold flex mt-8 mb-8">
                        Token Module
                    </IonLabel>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6} xl={6}>
                            <IonLabel className="text-base">
                                Analytics WebHook{' '}
                            </IonLabel>
                            <div className="flex flex-row justify-between ">
                                <select
                                    value={
                                        dropdownValue.analyticsWebhookChannel
                                    }
                                    className="server-channel-dropdown"
                                    onChange={(event: any) => {
                                        updateWebHooks({
                                            webhook: 'analyticsWebhookChannel',
                                            channel: event.target.value,
                                        });
                                    }}
                                >
                                    <option value="">
                                        Please Select AnalyticsWebhookChannel
                                    </option>
                                    {getOption()}
                                </select>
                            </div>
                        </Grid>
                    </Grid>
                </>
            )}
        </>
    );
};

export default ServerModule;
