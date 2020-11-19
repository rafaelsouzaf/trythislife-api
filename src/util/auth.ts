const { OAuth2Client } = require('google-auth-library');

export interface AuthPayload {
    email: string;
    email_verified: boolean;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    locale: string;
    exp: number;
}

export class Auth {
    static validate(idToken: string): Promise<AuthPayload> {
        const client = new OAuth2Client('189006929761-ukvt201knbhpc744de3t55r2dqlg5jad.apps.googleusercontent.com');
        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: idToken,
                audience: '189006929761-ukvt201knbhpc744de3t55r2dqlg5jad.apps.googleusercontent.com',
            });
            const payload: AuthPayload = ticket.getPayload();
            return payload;
            // If request specified a G Suite domain:
            // const domain = payload['hd'];
        }
        return verify();
    }
}
