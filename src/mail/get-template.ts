import cons from 'consolidate';
import path from 'path';

export async function getEmailTemplate(templatePath: string, data?: any) {
  return await cons.pug(path.join(__dirname, 'templates', templatePath), {
    ...data,
  });
}
