import { logError, logInfo } from '@navikt/familie-logging';
import dotenv from 'dotenv';
dotenv.config();

const settAzureAdPropsFraEnv = () => {
    process.env.AAD_DISCOVERY_URL = process.env.AZURE_APP_WELL_KNOWN_URL;
    process.env.CLIENT_ID = process.env.AZURE_APP_CLIENT_ID;
    process.env.CLIENT_SECRET = process.env.AZURE_APP_CLIENT_SECRET;
};

const konfigurerAzure = () => {
    const host = process.env.HOST; // Enten familie-prosessering, dp-prosessering eller lokal
    if (!host) {
        logError(`Mangler påkrevd miljøvariabel 'HOST'`);
        process.exit(1);
    }
    logInfo(`Kjører opp miljø: ${process.env.ENV}`);

    switch (process.env.ENV) {
        case 'local':
            process.env.AAD_LOGOUT_REDIRECT_URL = `https://login.microsoftonline.com/navq.onmicrosoft.com/oauth2/logout?post_logout_redirect_uri=http:\\\\localhost:8000`;
            process.env.AAD_REDIRECT_URL = 'http://localhost:8000/auth/openid/callback';
            process.env.AAD_DISCOVERY_URL = `https://login.microsoftonline.com/navq.onmicrosoft.com/v2.0/.well-known/openid-configuration`;
            process.env.GRAPH_API = 'https://graph.microsoft.com/v1.0/me';
            break;
        case 'dev':
            process.env.AAD_LOGOUT_REDIRECT_URL = `https://login.microsoftonline.com/navq.onmicrosoft.com/oauth2/logout?post_logout_redirect_uri=https:\\\\${host}.intern.dev.nav.no`;
            process.env.AAD_REDIRECT_URL = `https://${host}.intern.dev.nav.no/auth/openid/callback`;
            process.env.GRAPH_API = 'https://graph.microsoft.com/v1.0/me';
            settAzureAdPropsFraEnv();
            break;
        case 'prod':
            process.env.AAD_LOGOUT_REDIRECT_URL = `https://login.microsoftonline.com/navno.onmicrosoft.com/oauth2/logout?post_logout_redirect_uri=https:\\\\${host}.intern.nav.no`;
            process.env.AAD_REDIRECT_URL = `https://${host}.intern.nav.no/auth/openid/callback`;
            process.env.GRAPH_API = 'https://graph.microsoft.com/v1.0/me';
            settAzureAdPropsFraEnv();
            break;
        default:
            break;
    }
};

konfigurerAzure();
