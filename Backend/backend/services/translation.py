import logging
from loguru import logger
from google_trans_new import google_translator

class translation:
    def translate(text: str, lang_src: str, lang_tgt: str) -> str:
        translator = google_translator()
        translated_text = translator.translate(
            text, 
            lang_src=lang_src, 
            lang_tgt=lang_tgt)
        logger.debug(f"translated text: {translated_text}")
        return translated_text