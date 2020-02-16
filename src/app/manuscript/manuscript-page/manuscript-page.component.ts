import { Component, Input, OnInit } from "@angular/core";
import { ManuscriptService } from "../manuscript.service";
import { Manuscript } from "../manuscript";
import { testDB, testFiles } from "../test/testFiles";
import { User } from "../user";
import { ManuscriptDetailsComponent } from "../manuscript-details/manuscript-details.component";

@Component({
  selector: "app-manuscript-page",
  templateUrl: "./manuscript-page.component.html",
  styleUrls: ["./manuscript-page.component.css"],
  providers: [ManuscriptService]
})
export class ManuscriptPageComponent implements OnInit {
  @Input() user: User;

  manuscripts: Manuscript[];
  showVersions: Map<String, Boolean> = new Map();
  activeWindows = [
    "Form",
    "Annotate",
    "View",
    "Align-Manuscripts",
    "Tasks",
    "Tools",
    "Flow_Create",
    "Flow_Edit",
    "Flow_Execute"
  ];
  currentActiveWindowNum: number = -1;

  testDB: boolean = false;
  testModel: boolean = false;
  testFiles: boolean = false;
  showForm: boolean;
  showMinForm: boolean = true;
  selectedManuscript: Manuscript = null;

  constructor(private manuscriptService: ManuscriptService) {}

  ngOnInit() {
    this.noManuscriptSelected();
    if (this.testDB) {
      this.manuscripts = testDB;
      return;
    }
    if (this.user) {
      this.getUserManuscripts();
    }
  }

  showVersion(id) {
    console.log(id);
    console.log(this.showVersions.get(id));
    this.showVersions.set(id, !this.showVersions.get(id));
    if (this.showVersions.get(id)) {
      document.getElementById("manuscriptButton" + id).style.backgroundColor =
        "#92b0c2";
    } else {
      document.getElementById("manuscriptButton" + id).style.backgroundColor =
        "";
    }
  }

  setUser(user: User) {
    this.user = user;
    console.log("User was set to ", this.user.username);
  }

  search() {
    var searchBar, filter, tr, td, txtValue;
    searchBar = document.getElementById("searchbar");
    filter = searchBar.value.toUpperCase();

    for (let manuscript of this.manuscripts) {
      tr = document.getElementById("manuscriptButton" + manuscript._id);
      td = tr.getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr.style.display = "";
        } else {
          tr.style.display = "none";
        }
      }
    }
  }

  userDropdown() {
    var disp = document.getElementById("userDropdown");
    if (disp.style.display === "block") {
      disp.style.display = "none";
    } else {
      disp.style.display = "block";
    }
  }

  optionDropdown() {
    var disp = document.getElementById("optionDropdown");
    if (disp.style.display === "block") {
      disp.style.display = "none";
    } else {
      disp.style.display = "block";
    }
  }

  flowDropdown() {
    var disp = document.getElementById("flowDropdown");
    if (disp.style.display === "block") {
      disp.style.display = "none";
    } else {
      disp.style.display = "block";
    }
  }

  closeDropdowns(target) {
    var userDropdown = document.getElementById("userDropdown");
    var optionDropdown = document.getElementById("optionDropdown");
    var flowDropdown = document.getElementById("flowDropdown");
    var targetId = target.id;
    if (userDropdown.style.display === "block") {
      if (
        targetId !== "userButton" &&
        !this.wasSelfClicked(target, "userDropdown")
      ) {
        userDropdown.style.display = "none";
      }
    }
    if (optionDropdown.style.display === "block") {
      if (
        targetId !== "optionButton" &&
        targetId !== "moreOptionsIcon" &&
        !this.wasSelfClicked(target, "optionDropdown")
      ) {
        optionDropdown.style.display = "none";
      }
    }
    if (flowDropdown.style.display === "block") {
      if (
        targetId !== "flowButton" &&
        !this.wasSelfClicked(target, "flowDropdown")
      ) {
        flowDropdown.style.display = "none";
      }
    }
  }

  wasSelfClicked(target, elementId) {
    if (target.id === elementId || target.parentNode.id === elementId) {
      return true;
    }
    return false;
  }

  selectManuscript(manuscript) {
    this.selectedManuscript = manuscript;
    this.showForm = Boolean(manuscript);
    this.showMinForm = true;
    console.log(manuscript);
    if (manuscript) this.toggleMainWindow(0);
  }

  manuscriptSelected(manuscript) {
    if (
      this.selectedManuscript !== null &&
      this.selectedManuscript !== manuscript
    ) {
      document.getElementById(
        "manuscriptButton" + this.selectedManuscript._id
      ).style.backgroundColor = "";
      this.toggleMainWindow(-1);
    }
    this.selectManuscript(manuscript);
    document.getElementById(
      "manuscriptButton" + manuscript._id
    ).style.backgroundColor = "#92b0c2";
    var buttons = document.getElementsByClassName("mainButton");
    var i;
    for (i = 0; i < buttons.length; i++) {
      (<HTMLInputElement>buttons[i]).disabled = false;
      (<HTMLInputElement>buttons[i]).style.cursor = "pointer";
      (<HTMLInputElement>buttons[i]).style.color = "blue";
    }
  }

  manuscriptSelectedWithID(manuscript, id) {
    if (
      this.selectedManuscript !== null &&
      this.selectedManuscript !== manuscript
    ) {
      this.selectedManuscript._id = id;
      document.getElementById(
        "manuscriptButton" + this.selectedManuscript._id
      ).style.backgroundColor = "";
      this.toggleMainWindow(-1);
    }
    manuscript._id = id;
    this.selectManuscript(manuscript);
    document.getElementById(
      "manuscriptButton" + manuscript._id
    ).style.backgroundColor = "#92b0c2";
    var buttons = document.getElementsByClassName("mainButton");
    var i;
    for (i = 0; i < buttons.length; i++) {
      (<HTMLInputElement>buttons[i]).disabled = false;
      (<HTMLInputElement>buttons[i]).style.cursor = "pointer";
      (<HTMLInputElement>buttons[i]).style.color = "blue";
    }
  }

  manuscriptSelectedWithIDVersion(manuscript, id) {
    this.setVersionPostUpdate(id);
  }

  setVersionPostUpdate(versionId: string) {
    this.manuscriptService
      .getManuscriptbyId(versionId)
      .then((manuscriptVersion: Manuscript) => {
        this.selectManuscript(manuscriptVersion);
        console.log("HAHAHAHA");
        console.log(this.selectedManuscript);
      });
  }

  noManuscriptSelected() {
    console.log(this.selectedManuscript);
    if (this.selectedManuscript !== null) {
      document.getElementById(
        "manuscriptButton" + this.selectedManuscript._id
      ).style.backgroundColor = "";
      this.toggleMainWindow(-1);
      this.selectManuscript(null);
    }
    var buttons = document.getElementsByClassName("mainButton");
    var i;
    for (i = 0; i < buttons.length; i++) {
      (<HTMLInputElement>buttons[i]).disabled = true;
      (<HTMLInputElement>buttons[i]).style.cursor = "auto";
      (<HTMLInputElement>buttons[i]).style.color = "gray";
    }
  }

  manuscriptHoverOn(id) {
    document.getElementById("manuscriptHover" + id).style.display = "inline";
  }

  manuscriptHoverOff(id) {
    document.getElementById("manuscriptHover" + id).style.display = "none";
  }

  toggleMainWindow(num) {
    if (this.currentActiveWindowNum !== -1) {
      document.getElementById(
        this.activeWindows[this.currentActiveWindowNum]
      ).style.display = "none";
    }
    if (num === -1) {
      this.currentActiveWindowNum = -1;
    } else {
      var element = document.getElementById(this.activeWindows[num]);
      if (element) {
        element.style.display = "block";
        this.currentActiveWindowNum = num;
      }
    }
  }

  private getIndexOfManuscript = (manuscriptId: String) => {
    return this.manuscripts.findIndex(manuscript => {
      return manuscript._id === manuscriptId;
    });
  };

  getUserManuscripts() {
    this.manuscriptService
      .getManuscripts(this.user._id)
      .then((manuscripts: Manuscript[]) => {
        this.manuscripts = manuscripts;
        console.log("got manuscripts for user:", this.user._id);
        console.dir(this.manuscripts);
        for (let manuscript of this.manuscripts) {
          this.showVersions.set(manuscript._id, false);
        }
      })
      .catch(err => {
        console.log("Server GET error:" + err.toString());
        this.manuscripts = [];
      });
  }

  createNewManuscript() {
    this.showForm = true;
    this.showMinForm = true;
    this.noManuscriptSelected();
    var manuscript: Manuscript = !this.testModel
      ? new Manuscript(
          "",
          "",
          "",
          "",
          null,
          null,
          "",
          "",
          "English",
          "",
          "",
          [],
          [],
          this.testFiles ? testFiles : []
        )
      : <Manuscript>JSON.parse(JSON.stringify(testDB[0])); //deep copy from testDB
    this.selectManuscript(manuscript);
  }

  deleteManuscript = (manuscriptId: String) => {
    var idx = this.getIndexOfManuscript(manuscriptId);
    if (idx !== -1) {
      this.manuscripts.splice(idx, 1);
      this.selectManuscript(null);
    }
    return this.manuscripts;
  };

  addManuscript = (manuscript: Manuscript) => {
    this.manuscripts.push(manuscript);
    this.selectManuscript(manuscript);
    return this.manuscripts;
  };

  updateManuscript = (manuscript: Manuscript) => {
    var idx = this.getIndexOfManuscript(manuscript._id);
    if (idx !== -1) {
      this.manuscripts[idx] = manuscript;
      this.selectManuscript(manuscript);
    }
    return this.manuscripts;
  };

  close() {
    //TODO
  }
}
