import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { ApiService } from '../api.service';
import { MyErrorStateMatcher } from '../MyErrorStateMatcher';
import { ILanguageTranslation } from '../ILanguageTranslation';
import * as Sentry from '@sentry/browser';
import { TranslationResponse } from './TranslationResponse';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss']
})
export class TranslateComponent implements OnInit, OnDestroy {

  isLoading = true;
  isSaving = false;

  public MaxCharsForTranslation = 4000;

  public TranslatedText: string = '';

  public availableLanguages: Array<string> = new Array<string>();
  public formGroupBasic: FormGroup;

  public matcher = new MyErrorStateMatcher();

  private subscription: Subscription = new Subscription();

  public languageTranslations: { [id: string]: ILanguageTranslation; } = {
    "es": { translation: "Español" },
    "en": { translation: "English" },
    "de": { translation: "Deutsche" },
    "pt": { translation: "Português" },
    "fr": { translation: "Français" }
 };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private apiService: ApiService
  ) {
    // Empty
    this.formGroupBasic = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.resetValues();
    this.getData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  resetValues(): void {
    this.TranslatedText = '';
    this.availableLanguages = [
      "en",
      "es",
      "de"
    ];
    this.formGroupBasic = this.formBuilder.group({
      lang_src: [null,
        Validators.compose([
          Validators.required
        ])],
      lang_tgt: [null,
        Validators.compose([
          Validators.required
        ])],
      text: [null,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(this.MaxCharsForTranslation)
        ])]
    });
  }

  onFormSubmit(): void {
    this.isSaving = true;
    this.subscription.add(
      this.apiService.translateText(this.formGroupBasic.value).subscribe(
        (result) => {
          this.isSaving = false;
          if (result === undefined || result === null) {
            alert("There was an error translating the test.");
          } else {
            var translationResponse = result as TranslationResponse;
            this.TranslatedText = translationResponse.translated_text;
          }
        },
        (err: any) => {
          Sentry.captureMessage(JSON.stringify(err), Sentry.Severity.Error);
          alert("There was an error translating the test.");
          console.log(err);
          this.isSaving = false;
        }
      )
    );

  }

  private getData() {
    // Observables to combine
    const availableLanguages$ = this.apiService.getAvailableLanguagesFromServer();

    forkJoin([
      availableLanguages$,
    ]).subscribe(
      ([availableLanguages]) => {
        if (availableLanguages !== undefined && availableLanguages !== null) {
          this.availableLanguages = availableLanguages;
        }
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }
}
