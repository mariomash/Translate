from fastapi import FastAPI
from google_trans_new import google_translator  

app = FastAPI()


@app.post("/")
def index(lang: str, text: str):
	translator = google_translator()
	translated_text = translator.translate(text,lang_tgt=lang)
	return {
		"lang": lang,
		"text": text,
		"translated": translated_text
		}
