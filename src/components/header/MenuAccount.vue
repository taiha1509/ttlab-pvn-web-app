<template>
    <div class="user-dropdown">
        <el-dropdown trigger="click">
            <a href="#" class="nav-link">
                <div class="d-flex align-items-center" style="padding: 0 16px">
                    <span class="user-name">{{ userName }}</span>
                    <span class="user-img mr-2">
                        <img style="margin-bottom: 2px" :src="imageUrl" alt="" />
                    </span>
                </div>
            </a>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="onClickProfileButton">
                        {{ $t('common.app.menuAccount.myProfile') }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="logout">
                        {{ $t('common.app.menuAccount.logout') }}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import router from '@/router';
import { PageName } from '@/modules/common/constants';
import { logout } from '@/modules/auth/composition/loginForm';
import { appService } from '@/utils/app';

@Options({})
export default class MenuAccount extends Vue {
    get imageUrl(): string {
        // TODO get image url
        return require('@/assets/images/avatar-default.png');
    }

    get userName(): string {
        return appService.getUser().username;
    }

    onClickProfileButton(): void {
        router.push({
            name: PageName.PROFILE_PAGE,
        });
    }

    logout(): void {
        logout();
    }
}
</script>

<style lang="scss" scoped>
.el-dropdown-menu {
    padding: 0 !important;
}
.user-dropdown {
    background-color: transparent;
    border: none;
    padding: 0 2px;
    height: 100%;
    display: flex;
    align-items: center;
    .user-img {
        margin-left: 5px;
        display: inline-block;
        position: relative;
        img {
            width: 25px;
            border-radius: 50%;
            height: 25px;
        }
    }
    .user-name {
        color: #212121;
        @media only screen and (max-width: 991.98px) {
            display: none;
        }
    }
    .nav-link {
        padding: 0px;
        @media only screen and (max-width: 991.98px) {
            padding-left: 0;
        }
        &:hover {
            background-color: #ededed;
        }
    }
}

.user-name {
    max-width: 150px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
</style>
