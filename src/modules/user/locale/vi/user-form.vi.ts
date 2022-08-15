export default {
    popup: {
        titleCreate: 'Tạo người dùng',
        titleUpdate: 'Cập nhật người dùng',
        titleDetail: 'Thông tin người dùng',
        delete: {
            title: 'Xóa người dùng',
            confirmAsk: 'Bạn có chắc chắn muốn xóa tài khoản {username} không?',
        },
    },
    table: {
        fullName: 'Họ tên',
        phoneNumber: 'Số điện thoại',
        email: 'Email',
        username: 'Tên truy nhập',
        roles: 'Các vai trò',
        status: 'Trạng thái',
        groups: 'Các nhóm người dùng',
        password: 'Mật khẩu',
        newPassword: 'Mật khẩu mới',
        confirmPassword: 'Xác nhận mật khẩu',
        cameras: 'Các Camera',
        cameraGroups: 'Các nhóm camera',
        firstLogin: 'Đăng nhập lần đầu',
    },
    button: {
        cancel: 'Hủy',
        submit: 'Lưu',
        resend: 'Gửi lại',
        update: 'Cập nhật',
        delete: 'Xóa',
    },
    errors: {
        invalid: {
            fullName: 'Họ tên không được chứa ký tự đặc biệt.',
            username: 'Tên truy nhập không được chứa ký tự đặc biệt.',
            email: 'Địa chỉ mail chưa đúng. Vui lòng nhập lại.',
            phoneNumber: 'Số điện thoại chưa đúng. Vui lòng nhập lại.',
            password:
                'Mật khẩu phải chứa ít nhất 8 ký tự và bao gồm ít nhât 1 chữ số, 1 chữ thường, 1 chữ hoa và 1 ký tư đăc biệt.',
            confirmPassword: 'Xác nhận mật khẩu chưa đúng.',
            newPassword: 'Mật khẩu mới không được trùng với mật khẩu cũ.',
        },
        empty: {
            role: 'Vai trò là trường bắt buộc',
        },
    },
    placeholder: {
        username: 'Nhập tên truy nhập',
        email: 'Nhập email',
        phoneNumber: 'Nhập số điện thoại di động',
        fullName: 'Nhập họ tên',
        groupIds: 'Chọn các nhóm',
        roleIds: 'Chọn các vai trò',
        cameraGroupIds: 'Chọn các nhóm camera',
        cameraIds: 'Chọn các camera',
        password: 'Nhập mật khẩu',
        confirmPassword: 'Nhập xác nhận mật khẩu',
    },
    message: {
        delete: {
            success: 'Xóa người dùng thành công!',
        },
        create: {
            success: 'Tạo người dùng thành công!',
        },
        update: {
            success: 'Cập nhật người dùng thành công!',
        },
        resend: {
            success: 'Gửi lại link xác thực thành công!',
        },
    },
    status: {
        active: 'Đã kích hoạt',
        inactive: 'Hủy kích hoạt',
        registering: 'Đang đăng ký',
    },
};
