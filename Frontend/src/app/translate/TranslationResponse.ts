

export class TranslationResponse {
  lang: string = "";
  text: string = "";
  translated_text: string = "";

  public constructor(init?: Partial<TranslationResponse>) {
  }
}
