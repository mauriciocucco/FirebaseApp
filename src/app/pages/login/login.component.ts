import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import Swal from "sweetalert2";
import { Usuario } from "../../models/usuario.model";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  usuario: Usuario = new Usuario();
  mensajeError: string;
  recordarme: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem("email")) {
      this.usuario.email = localStorage.getItem("email");
      this.recordarme = true;
    }
  }

  login(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      text: "Espere por favor...",
      icon: "info",
      allowOutsideClick: false,
    });
    Swal.showLoading();

    this.auth.login(this.usuario).subscribe(
      (response) => {
        console.log(response);
        Swal.close();

        if (this.recordarme) {
          localStorage.setItem("email", this.usuario.email);
        }

        this.router.navigateByUrl("/home");
      },
      (e) => {
        if (e.error.error.message === "INVALID_PASSWORD") {
          this.mensajeError = "Password inválido";
        } else if (e.error.error.message === "EMAIL_NOT_FOUND") {
          this.mensajeError = "Email no encontrado";
        }

        Swal.fire({
          title: "Error al autenticar",
          text: this.mensajeError,
          icon: "error",
        });

        this.mensajeError = "Hubo un error";
      }
    );
  }
}
