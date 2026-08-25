declare module '@nestjs/platform-express' {
  export const MulterModule: any;
  export function FileInterceptor(fieldName: string, options?: any): any;
  export function FilesInterceptor(fieldName: string, maxCount?: number, options?: any): any;
}
