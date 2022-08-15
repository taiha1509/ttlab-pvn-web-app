export default {
    cameraDetail: {
        title: 'Thông tin camera',
    },
    fields: {
        name: {
            label: 'Tên camera',
            placeholder: 'Nhập tên camera',
        },
        uid: {
            label: 'UID',
            placeholder: 'Nhập UID',
        },
        model: {
            label: 'Mẫu',
            placeholder: 'Chọn mẫu',
        },
        serialNumber: {
            label: 'Số serial',
            placeholder: 'Nhập số serial',
        },
        connection: {
            placeholder: 'Trạng thái kết nối',
        },
        cameraGroupId: {
            label: 'Các nhóm camera',
            placeholder: 'Chọn các nhóm camera',
        },
        userIds: {
            label: 'Các người dùng',
            placeholder: 'Chọn các người dùng',
        },
        password: {
            label: 'Mật khẩu',
            placeholder: 'Nhập mật khẩu',
        },
        userName: {
            label: 'Tên truy nhập',
            placeholder: 'Nhập tên truy nhập',
        },
        groupUserIds: {
            label: 'Các nhóm người dùng',
            placeholder: 'Chọn các nhóm người dùng',
        },
        requestONVIF: 'Lấy hồ sơ ONVIF',
    },
    table: {
        name: 'Tên camera',
        model: 'Mẫu camera',
        serialNumber: 'Số serial',
        uid: 'UID',
        actions: 'Hành động',
    },
    confirmPopup: {
        title: 'Xóa camera',
        message: 'Bạn có chắc chắn muốn xóa camera {name} không ?',
        deleteSuccess: 'Xóa camera thành công!',
    },
    update: {
        title: 'Cập nhật thông tin camera',
        message: 'Cập nhật thông tin thành công!',
        error: 'Cập nhật thông tin thất bại!',
    },
    create: {
        title: 'Thêm camera',
        P2P: 'P2P',
        ONVIF: 'ONVIF',
        message: 'Thêm camera thành công!',
        error: 'Thêm camera thất bại!',
    },
    button: {
        settings: 'Cấu hình',
    },
    filterForm: {
        name: {
            label: 'Keyword',
            placeholder: 'Tìm kiếm',
        },
        uid: {
            label: 'UID',
            placeholder: 'UID',
        },
    },
    connection: {
        offline: 'Offline',
        online: 'Online',
    },
    errors: {
        onvifProfile: 'Không thể kết nối tới camera!',
    },
};
