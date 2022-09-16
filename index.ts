// Import stylesheets
import './style.css';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>TypeScript Starter</h1>`;

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostDivElement: HTMLDivElement;
  formElement: HTMLFormElement;

  constructor() {
    this.templateElement = document.getElementById(
      'project-input'
    )! as HTMLTemplateElement;

    // importNode로 깊은 복산느 왜 하는거임?
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    this.formElement = importedNode.firstElementChild as HTMLFormElement;
    this.attach();
  }

  /**
   * Project Input이 인스턴스화 되면서 dom에 렌더링하기 위한 함수
   */
  private attach() {
    /** app 아이디를 가지고 있는 요소에 formElement 삽입 */
    appDiv.insertAdjacentElement('afterbegin', this.formElement);
  }
}

const prjInput = new ProjectInput();
