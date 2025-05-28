import { jest } from '@jest/globals';
import nodemailer from 'nodemailer';
import { handleForgotPassword } from '../../public/forgotPassword.js';

jest.mock('nodemailer');

describe('handleForgotPassword', () => {
  let sendMailMock;

  beforeAll(() => {
    sendMailMock = jest.fn().mockResolvedValue(true);
    nodemailer.createTransport.mockReturnValue({
      sendMail: sendMailMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('geçerli email ile başarılı e-posta gönderimi', async () => {
    const result = await handleForgotPassword('test@example.com');

    expect(sendMailMock).toHaveBeenCalled();
    expect(result.ok).toBe(true);
    expect(result.data.message).toBe('Şifre sıfırlama e-postası gönderildi.');
  });

  test('email boş ise hata dönmeli', async () => {
    const result = await handleForgotPassword('');

    expect(sendMailMock).not.toHaveBeenCalled();
    expect(result.ok).toBe(false);
    expect(result.data.message).toBe('Email gerekli');
  });

  test('e-posta gönderiminde hata olursa uygun mesaj dönmeli', async () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });

    sendMailMock.mockRejectedValueOnce(new Error('SMTP error'));

    const result = await handleForgotPassword('fail@example.com');

    expect(sendMailMock).toHaveBeenCalled();
    expect(result.ok).toBe(false);
    expect(result.data.message).toBe('E-posta gönderilirken bir hata oluştu.');

    consoleErrorMock.mockRestore();
  });

});
