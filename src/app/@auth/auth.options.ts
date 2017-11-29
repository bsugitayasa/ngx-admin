import { InjectionToken } from '@angular/core';

export interface NbModuleConfig {
  alwaysFail?: boolean;
  rememberMe?: boolean;
  endpoint?: string;
  method?: string;
  redirect?: {
    success?: string | null;
    failure?: string | null;
  };
  defaultErrors?: string[];
  defaultMessages?: string[];
}

export interface NbResetModuleConfig extends NbModuleConfig {
  resetPasswordTokenKey?: string;
}

export interface NgAuthProviderConfig {
  baseEndpoint?: string;
  login?: boolean | NbModuleConfig;
  register?: boolean | NbModuleConfig;
  requestPass?: boolean | NbModuleConfig;
  resetPass?: boolean | NbResetModuleConfig;
  logout?: boolean | NbResetModuleConfig;
  security?: {
    clientId?: string;
    clientSecret?: string;
    grantType?: string;
  };
  token?: {
    key?: string;
    getter?: Function;
  };
  errors?: {
    key?: string;
    getter?: Function;
  };
  messages?: {
    key?: string;
    getter?: Function;
  };
  validation?: {
    password?: {
      required?: boolean;
      minLength?: number | null;
      maxLength?: number | null;
      regexp?: string | null;
    };
    email?: {
      required?: boolean;
      regexp?: string | null;
    };
    fullName?: {
      required?: boolean;
      minLength?: number | null;
      maxLength?: number | null;
      regexp?: string | null;
    };
  };
}

export interface NbAuthOptions {
  forms?: any;
  providers?: any;
}

export interface NbAuthProvidersInterface {
  [key: string]: any;
}

export const defaultSettings: any = {
  forms: {
    login: {
      redirectDelay: 500,
      provider: 'username',
      rememberMe: true,
      showMessages: {
        success: true,
        error: true,
      },
    },
    register: {
      redirectDelay: 500,
      provider: 'username',
      showMessages: {
        success: true,
        error: true,
      },
      terms: true,
    },
    requestPassword: {
      redirectDelay: 500,
      provider: 'username',
      showMessages: {
        success: true,
        error: true,
      },
    },
    resetPassword: {
      redirectDelay: 500,
      provider: 'username',
      showMessages: {
        success: true,
        error: true,
      },
    },
    logout: {
      redirectDelay: 500,
      provider: 'username',
    },
    validation: {
      password: {
        required: true,
        minLength: 4,
        maxLength: 50,
      },
      email: {
        required: false,
      },
      fullName: {
        required: false,
        minLength: 4,
        maxLength: 50,
      },
    },
  },

};

export const NB_AUTH_OPTIONS_TOKEN = new InjectionToken<NbAuthOptions>('Nebular Auth Options');
export const NB_AUTH_USER_OPTIONS_TOKEN = new InjectionToken<NbAuthOptions>('Nebular User Auth Options');
export const NB_AUTH_PROVIDERS_TOKEN = new InjectionToken<NbAuthProvidersInterface>('Nebular Auth Providers');
export const NB_AUTH_TOKEN_WRAPPER_TOKEN = new InjectionToken<NbAuthProvidersInterface>('Nebular Auth Token');
export const NB_AUTH_INTERCEPTOR_HEADER = new InjectionToken<NbAuthProvidersInterface>('Nebular Simple Interceptor Header');
