import { Component, ViewChild } from "@angular/core";
import { ManuscriptPageComponent } from "../manuscript/manuscript-page/manuscript-page.component";
import { User } from "../manuscript/user";

@Component({
  selector: "app-user-page",
  templateUrl: "./user-page.component.html",
  styleUrls: ["./user-page.component.css"]
})
export class UserPageComponent {
  @ViewChild(ManuscriptPageComponent) child: ManuscriptPageComponent;

  user: User;
  show: boolean = false;
  test_users = [
    { _id: "111111111111111111111111", username: "Scooby Doo", canEdit: false },
    { _id: "222222222222222222222222", username: "Never Again", canEdit: true },
    { _id: "333333333333333333333333", username: "Dani Roop", canEdit: false }
  ];

  constructor() {}

  //MUST USE THIS METHOD
  setUser(user: User) {
    history.pushState("", "", "manuscript-page");
    this.show = true;
    this.user = user;
    console.log("Changing to user ", this.user.username);
    this.child.setUser(user);
    this.child.ngOnInit();
  }

  setUserTest(i: number) {
    this.setUser(this.test_users[i]);
  }
}
