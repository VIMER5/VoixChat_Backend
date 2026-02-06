const { cdn_url } = process.env;
class appService {
  async normolizeUrlAvatar(data: any[]): Promise<any[]> {
    let res = data.map((item: any) => {
      let temp = item;
      temp.avatar = `${cdn_url}/image/${item.avatar}/thumb`;
      return temp;
    });
    return res;
  }

  async normolizeUrlAvatarStr(data: string | null): Promise<string | null> {
    if (data == null) return data;
    return `${cdn_url}/image/${data}/thumb`;
  }
}

export default new appService();
