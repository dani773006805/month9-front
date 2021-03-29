import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Luv2ShopValidators} from "../../validators/luv2-shop-validators";
import {ActivatedRoute, Router} from "@angular/router";
import {ReviewServiceService} from "../../services/review-service.service";
import {Review} from "../../common/review";

@Component({
  selector: 'app-review-component',
  templateUrl: './review-component.component.html',
  styleUrls: ['./review-component.component.css']
})
export class ReviewComponentComponent implements OnInit {
  reviewFormGroup: FormGroup;
  productId: string = undefined;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private reviewService: ReviewServiceService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
    this.reviewFormGroup = this.formBuilder.group({
      review: this.formBuilder.group({
        text: new FormControl('', [Validators.required, Validators.minLength(4), Luv2ShopValidators.notOnlyWhitespace]),
      }),
    });
  }

  handleProductDetails() {
    this.productId = this.route.snapshot.paramMap.get('productId');
  }

  get reviewText() {
    return this.reviewFormGroup.get('review.text');
  }

  onSubmit() {
    if (this.reviewFormGroup.invalid) {
      this.reviewFormGroup.markAllAsTouched();
      return;
    }

    const reviewForm = this.reviewFormGroup.controls['review'].value;
    let review = new Review();
    review.text = reviewForm.text;
    review.productId = this.productId;
    this.reviewService.postReview(review).subscribe(
      {
        next: response => {
          alert(`Your review has been received. You can view your reviews in product-details section`);
          this.router.navigateByUrl(`/products/${this.productId}`);

        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    )
  }


}
