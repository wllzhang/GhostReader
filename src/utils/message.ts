import { window } from 'vscode';

export default function message(message = '你好！') {
  window.showInformationMessage(message);
}

message.warn = (message = '警告！') => {
  window.showWarningMessage(message);
};

message.error = (message = '错误！') => {
  window.showErrorMessage(message);
};

message.input = async (prompt: string, value?: string): Promise<string | undefined> => {
  return await window.showInputBox({
    prompt,
    value,
    validateInput: (text) => {
      return text ? null : '输入不能为空';
    },
  });
};
