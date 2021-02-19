import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { ApiService } from '../api.service';
import { MyErrorStateMatcher } from '../MyErrorStateMatcher';

interface ILanguageTranslation {
  translation: string;
}

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss']
})
export class TranslateComponent implements OnInit, OnDestroy {

  isLoading = true;
  isSaving = false;

  public availableLanguages: Array<string> = new Array<string>();
  public formGroupBasic: FormGroup;

  public matcher = new MyErrorStateMatcher();

  private subscription: Subscription = new Subscription();

  public languageTranslations: { [id: string]: ILanguageTranslation; } = {
    "es": { translation: "Español" },
    "en": { translation: "English" },
    "de": { translation: "Deutsche" }
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
    this.availableLanguages = [
      "en",
      "es",
      "de"
    ];
    this.formGroupBasic = this.formBuilder.group({
      LanguageTo: [null,
        Validators.compose([
          Validators.required
        ])],
      Text: [null,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(4000)
        ])],
      Result: [{ value: null, disabled: true },
          Validators.compose([
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(4000)
          ])]
    });
  }

  onFormSubmit(): void {
    this.isSaving = true;
/*
    const validationResult = new ValidationResult({
      Id: this.validationResult.Id,
      Name: this.formGroupBasic.get('Name').value,
      Description: this.formGroupBasic.get('Description').value,
      Color: this.formGroupBasic.get('Color').value,
      Disabled: this.formGroupBasic.get('Disabled').value
    });

    this.subscription.add(
      this.apiService.saveValidationResult(validationResult).subscribe(
        (result) => {
          this.isSaving = false;
          this.changeDetectorRef.detectChanges();
          if (result === undefined || result === null) {
            this.matDialog.open(DialogSimpleComponent, {
              data: {
                Title: 'Error',
                Description:
                  'There was an error saving the validation result. Please try again and contact us if neccessary',
                ShowCancelButton: false,
                ShowDontShowAgainButton: false
              }
            });
          } else {
            const dialogRef = this.matDialog.open(DialogSimpleComponent, {
              data: {
                Title: 'Information',
                Description: `Validation Result saved successfully.`,
                ShowCancelButton: false,
                ShowDontShowAgainButton: false
              }
            });

            dialogRef.afterClosed().subscribe(async () => {
              // this.router.navigate(['/forms']);
              this.router.navigate(['/admin/settings']);
            });
          }
        },
        (err: any) => {
          Sentry.captureMessage(JSON.stringify(err), Sentry.Severity.Error);
          if (
            environment.production === false &&
            environment.debugLog === true
          ) {
            console.log(err);
          }
          this.isSaving = false;
        }
      )
    );
  */
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
