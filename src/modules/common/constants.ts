// layouts
export const MAIN_LAYOUT_NAME = 'MainLayout';
export const GUEST_LAYOUT_NAME = 'GuestLayout';
export const LOGIN_LAYOUT_NAME = 'LoginLayout';
export const ERROR_LAYOUT_NAME = 'ErrorLayout';
export const HEIGHT_HEADER = 64;
export const HEIGHT_HEADER_OF_CONTENT = 80;

export const HEIGHT_HEADER_FOOTER_AND_PAGINATION = 224;
export const HEIGHT_HEADER_FOOTER_PAGINATION_AND_HEADER = 340;
export const HEIGHT_PAGINATION = 40;

export const DATE_TIME_FORMAT = {
    YYYY_MM_DD_HYPHEN: 'YYYY-MM-DD',
    YYYY_MM_DD_HYPHEN_HH_mm_ss_DIV: 'YYYY-MM-DD HH:mm:ss',
    YYYY_MM_DD_HYPHEN_HH_mm_DIV: 'YYYY-MM-DD HH:mm',
    HH_mm_COLON: 'HH:mm',
    DD_MM_YYYY_SLASH: 'DD/MM/YYYY',
};

// max size upload file 2 * 1024 * 1024 = 2097152
export const MAX_SIZE_FILE = 2097152;

// textarea
export const TEXTAREA_DEFAULT_ROWS = 3;
export const TEXTAREA_MAX_ROW = 10;
export const TEXTAREA_MIN_ROW = 1;
export const TEXTAREA_MAX_LENGTH = 2000;
export const TEXT_MAX_LENGTH = 255;
export const TEXTAREA_MIN_LENGTH = 0;
export const PASSWORD_MIN_LENGTH = 6;

// pagination
export const DEFAULT_FIRST_PAGE = 1;
export const DEFAULT_SIZE_PER_PAGE = 10;
export const DEFAULT_CAMERA_SIZE = 16;
export const DEFAULT_SIZE_PER_PAGE_OPTIONS = [10, 50, 100];

export enum PageName {
    LOGIN_PAGE = 'LoginPage',
    FORGOT_PASSWORD_PAGE = 'ForgotPasswordPage',
    RESET_PASSWORD_PAGE = 'ResetPasswordPage',
    DASHBOARD_PAGE = 'DashboardPage',
    CAMERA_PAGE = 'CameraPage',
    PROFILE_PAGE = 'ProfilePage',
    USER_PAGE = 'UserPage',
    GROUP_USER_PAGE = 'GroupUserPage',
    CAMERA_GROUP_PAGE = 'CameraGroupPage',
    VERIFY_EMAIL_INVITATION_PAGE = 'VerifyEmailInvitationPage',
    MONITOR_PAGE = 'MonitorPage',
    PLAYBACK_PAGE = 'PlaybackPage',
    PLAYBACK_DETAIL_PAGE = 'PlaybackDetailPage',
    LAYOUT_MAP_PAGE = 'LayoutMapPage',
    ROLE = 'Role',
    ERROR_403_PAGE = 'Error403Page',
    ERROR_404_PAGE = 'Error404Page',
}

export enum OrderDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}

export enum ElTableOrderDirection {
    ASCENDING = 'ascending',
    DESCENDING = 'descending',
}

export const Order = {
    ASC: {
        value: OrderDirection.ASC,
        label: 'Z - A',
    },
    DESC: {
        value: OrderDirection.DESC,
        label: 'A - Z',
    },
};

export const REGEX = {
    EMAIL: /([a-zA-Z0-9]+)([_.\-{1}])?([a-zA-Z0-9]+)@([a-zA-Z0-9]+)([.])([a-zA-Z.]+)/,
    PHONE: /^(0)[\d]{9}$/,
    URL_CV: /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
    URL: /^https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/,
    NUMBER: /^(?:[0-9]\d*|)$/,
    TEXT_WITHOUT_SPECIAL_CHARACTERS: /^((?![!@#$%^&*()<>?\\/\\+|=]+).)*$/,
    OBJECT_ID: /^[a-fA-F0-9]{24}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    TIME_REGEX: /^([0-1][0-9]|2[0-3]):([0-5][0-9])$|^$/,
    UID_REGEX: /^[a-zA-Z0-9]*$/,
};

export const BIRTHDAY_MIN_DATE = '1800-01-01 00:00:00';

export const DEFAULT_PADDING_DROPDOWN_ITEM = 33;

export const USER_LIMIT = 40;

export enum SupportLanguage {
    EN = 'en',
    VI = 'vi',
}
export const DEFAULT_ORDER_BY = 'createdAt';

export const timezone = 'Asia/Ho_Chi_Minh';

export const SIDEBAR_XL = 1317;

export const MAX_GROUP_LEVEL = 4;

export enum CameraListOrderBy {
    CREATED_AT = 'createdAt',
    NAME = 'name',
    SERIAL_NUMBER = 'serialNumber',
}

export const DEFAULT_FONT_SIZE = 14;

// tree
export const ROOT_LEVEL = 1;
export const MAX_CHILDREN = 20;

export enum AcceptFileTypes {
    IMAGE = 'image/*',
    ALL = '*',
    LAYOUT_MAP = '.bmp,.png,.jpg,.jpeg',
}

export enum FilePath {
    CVM = 'cvm',
}

export enum HttpStatus {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    INVALID_USERNAME_OR_PASSWORD = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    GROUP_HAS_CHILDREN = 410,
    GROUP_MAX_LEVEL = 411,
    GROUP_MAX_QUANTITY = 412,
    CVM_ERROR = 420,
    UNPROCESSABLE_ENTITY = 422,
    FORBIDDEN_MODIFY_SUPER_ADMIN = 423,
    ITEM_NOT_EXISTED = 444,
    ITEM_ALREADY_EXIST = 445,
    ITEM_INVALID = 446,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
    TOKEN_INVALID = 405,
}
