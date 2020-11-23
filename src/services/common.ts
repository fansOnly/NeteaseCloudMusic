import { get } from '@/utils/http'

// 注册手机账号 / 修改密码
export const register = (phone: string, password: string, captcha: string, nickname?: string) => get('/register/cellphone', {phone, password, captcha, nickname})

// 手机号登录
export const loginPhone = (phone: string, password: string) => get("/login/cellphone", {phone, password})

// 邮箱登录
export const loginEmail = (email: string, password: string) => get("/login", { email, password });

// 检测手机号码是否已注册
export const existencePhone = (phone: string) => get('/cellphone/existence/check', {phone})

// 发送手机验证码
export const captchaSent = (phone: string) => get('/captcha/sent', {phone})

// 验证手机验证码
export const captchaVerify = (phone: string, captcha: string) => get('/captcha/verify', {phone, captcha})

// 验证登录状态
export const loginStatus = () => get('/login/status', {})

// 退出登录
export const logout = () => get('logout', {})
