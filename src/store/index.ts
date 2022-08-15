import { createLogger, createStore } from 'vuex';

import { appService } from '@/utils/app';
import { IUserDetailReponse } from '@/modules/user/types';
const user = appService.getUser<IUserDetailReponse>();

export default createStore({
    state: {
        loginUser: user,
    },
    mutations: {
        setLoginUser: (state, payload: IUserDetailReponse) => {
            state.loginUser = payload;
        },
    },
    actions: {
        setLoginUser: (context, payload: IUserDetailReponse) => {
            context.commit('setLoginUser', payload);
        },
    },
    modules: {},
    plugins: process.env.mode === 'debug' ? [createLogger()] : [],
});
