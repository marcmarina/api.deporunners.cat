import path from 'path';

import cons from 'consolidate';

export async function getEmailTemplate(templatePath: string, data?: any) {
  return await cons.pug(path.join(__dirname, 'templates', templatePath), {
    ...data,
  });
}
