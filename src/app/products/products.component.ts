import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductsService } from './products.service';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  myForm!: FormGroup;
  submitted = false;
  viewProduct: boolean = false;
  spinner: boolean = false;
  productData = [];
  ratingData = [];
  rate = [];
  itemImage = "";
  editId: string = "";
  editMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: ProductsService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      title: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      image: ['', Validators.required],
      count: ['', Validators.required],
      rate: ['', Validators.required]
    });

    this.getProducts();
  }

  onProfileUpload(event: any) {
    // const reader = new FileReader();

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.itemImage = file;
    }
  }

  get f() {
    return this.myForm.controls;
  }

  getProducts() {
    this.productData = [];
    this.service.getProducts().subscribe((data: any) => {
      this.productData = data;
      console.log("prod", data);
    });
  }

  onSubmit() {
    this.spinner = true;
    this.submitted = true;
    if (this.myForm.invalid) {
      this.spinner = false;
      return;
    }
    const body = this.myForm.value;
    console.log("editId", this.editId);
    if (this.myForm.valid) {
      if (this.editMode) {
        this.service.updateProduct(body, this.editId).subscribe(
          (data) => {
            if (data) {
              this.spinner = false;
              this.editMode = false;
              this.toastr.success(`Updated Successfully`);
              this.myForm.reset();
              this.editId = "";
              this.showCustomerTable();
              this.getProducts();
            } else {
              this.spinner = false;
              this.toastr.error(data["message"]);
            }
          },
          (err) => {
            this.spinner = false;
          }
        );
      } else {
        this.service.addProduct(body).subscribe(
          (data) => {
            if (data) {
              this.spinner = false;
              this.toastr.success(`Product Added Successfully`);
              this.myForm.reset();
              this.showCustomerTable();
              this.getProducts();
            } else {
              this.spinner = false;
              this.toastr.error(data["message"]);
            }
          },
          (err) => {
            this.spinner = false;
          }
        );
      }
    }
  }

  productEdit(id: any, i: any) {
    this.spinner = false;
    this.editMode = true;
    this.editId = id;
    this.showCustomerForm();
    this.myForm.patchValue({
      title: this.productData[i]['title'],
      price: this.productData[i]['price'],
      description: this.productData[i]['description'],
      category: this.productData[i]['category'],
      image: this.productData[i]['image'],
      count: this.productData[i]["rating"]["count"],
      rate: this.productData[i]["rating"]["rate"]
    });
    console.log("patchData", this.myForm)
  }


  delete(id: any) {
    console.log("deleteId", id);
    this.service.deleteProduct(id).subscribe((data) => {
      if (data) {
        this.spinner = false;
        this.toastr.warning(`Product Deleted Successfully`);
        this.showCustomerTable();
        // this.getProducts();
      } else {
        this.spinner = false;
        this.toastr.error(data["message"]);
      }
    },
      (err) => {
        this.spinner = false;
      });
  };

  showCustomerForm() {
    this.viewProduct = true;
    this.myForm.reset();
  }

  showCustomerTable() {
    this.submitted = false;
    this.viewProduct = false;
  }

}
