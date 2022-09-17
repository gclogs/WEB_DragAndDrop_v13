// Import stylesheets
import './style.css';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>TypeScript Starter</h1>`;

class ProjectState {
  private listeners: any[] = []; // 폼에서 받아온 값들을 리스너 배열에 넣을거임
  private projects: any[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstace() {
    if (this.instance) {
      // instance 변수에 데이터가 있으면
      return this.instance; // 그대로 반환
    }
    // 없으면
    this.instance = new ProjectState(); // 인스턴스로 받아옴
    return this.instance; // 나는 간다용!
  }

  /**
   * 리스너를 추가하기 위한 함수
   * listeners 배열에 listenerFn 의 인자값으로 함수를 받아온 데이터를 푸시
   */
  addListener(listenerFn: Function) {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = {
      id: Math.random().toString(), // 난수로 생성한 값을 고유 id로 할당
      title: title,
      description: description,
      people: numOfPeople,
    };
    this.projects.push(newProject); // 설계된 객체를 projects 배열에 푸시

    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice()); // slice() 메서드로 원본을 건들지 않고 새로운 복사본을 만들어 listenerFn 에 저장 -> 리스너 추가
    }
  }
}

const projectState = ProjectState.getInstace();

/**
 * 검증 인터페이스를 만들어서 내부 프로퍼티들을 사용해
 * 입력값들이 개발자가 원하는 방식으로 들어오는지 검증하기 위해 만듦.
 *
 * 옵셔널 연산자를 사용해 있어도 되고 없어도 되는 프로퍼티를 만듦.
 * value 프로퍼티는 반드시 필요함
 */
interface Validatable {
  value: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(input: Validatable) {
  if (input.required) {
    // input 요소중 required 프로퍼티가 true라면
    input.value.toString().trim().length !== 0; // input의 value의 길이가 공란이 되면 안됨. 즉 공백이면 안됨
    return true; // ok
  }

  if (input.minLength != null && typeof input.value == 'string') {
    // 최소 길이(minLength)에 값이 있고, 값의 타입이 string 이라면,
    if (input.value.length > input.minLength) {
      // value 길이가 mingLength 보다 커야함
      return true;
    }
  }
  if (input.maxLength != null && typeof input.value == 'string') {
    // 최대 길이(maxLength)에 값이 있고, 값의 타입이 string 이라면,
    if (input.value.length > input.maxLength) {
      // value 길이가 maxLength 보다 커야함
      return true;
    }
  }

  if (input.min != null && typeof input.value == 'number') {
    // 최솟값이 있고, 값의 타입이 number라면,
    if (input.value > input.min) {
      // value의 값이 min 보다 커야함
      return true;
    }
  }
  if (input.max != null && typeof input.value == 'number') {
    // 최댓값이 있고, 값의 타입이 number라면,
    if (input.value > input.max) {
      // value의 값이 max 보다 커야함
      return true;
    }
  }
}

class ProjectList {
  templateElement: HTMLTemplateElement;
  element: HTMLElement;
  assignedProjects: any[];

  constructor(private type: 'active' | 'finished') {
    this.templateElement = document.getElementById(
      'project-list'
    )! as HTMLTemplateElement;
    this.assignedProjects = [];

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = `${type}-projects`;

    /**
     * 프로젝트 상태 추가하기
     * projectState가 인스턴스 되므로 전역에서 사용할 수 있음.
     *
     * 접근하면서 private 프로퍼티도 역시 접근 가능
     */
    projectState.addListener((projects: any[]) => {
      this.assignedProjects = projects; // ProjectState 클래스의 projects 변수에 담겨있는 값을 assignedProjects에 할당
      this.renderProjects();
    });

    this.renderContent();
    this.attach();
  }

  private renderProjects() {
    const listElement = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement; // 해당 아이디를 갖고 있는 순서없는 목록 요소를 할당

    for (const projectItem of this.assignedProjects) {
      const listItem = document.createElement('li'); // li 태그를 가지고 있는 새로운 요소 생성
      listItem.textContent = projectItem.title; // li 태그의 textContent에 projectItem의 title 할당
      listElement.appendChild(listItem); // listElement에 listItem을 추기
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase();
  }

  private attach() {
    appDiv.insertAdjacentElement('beforeend', this.element);
  }
}

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostDivElement: HTMLDivElement;
  formElement: HTMLFormElement;

  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      'project-input'
    )! as HTMLTemplateElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.formElement = importedNode.firstElementChild as HTMLFormElement;
    this.formElement.id = 'user-input';

    this.titleInputElement = this.formElement.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionInputElement = this.formElement.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.peopleInputElement = this.formElement.querySelector(
      '#people'
    ) as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private attach() {
    appDiv.insertAdjacentElement('afterbegin', this.formElement);
  }

  /**
   * 튜플로 string, string, number 타입을 반환하는데
   * title, description, people을 위해 짜여진 구조를 반환
   */
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescripiton = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    /**
     * 검증을 위한 Validatable 인터페이스 타입을 가지고 설계
     */
    const ValiTitle: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const ValiDescription: Validatable = {
      value: enteredDescripiton,
      required: true,
      min: 1,
    };
    const ValiPeople: Validatable = {
      value: enteredPeople,
      required: true,
    };

    /**
     * 검증할 변수들을 validate 함수로 검증하고,
     * 검증이 완료되면 각 값들을 반환
     *
     * 검증이 안되면 다시 해
     */
    if (
      !validate(ValiTitle) &&
      !validate(ValiDescription) &&
      !validate(ValiPeople)
    ) {
      alert('Invalid input, plz try again');
      console.log('Invalid input, plz try again');
      return;
    } else {
      return [enteredTitle, enteredDescripiton, +enteredPeople];
    }
  }

  private submitHandler(event: Event) {
    event.preventDefault();

    const userInput = this.gatherUserInput(); // 검증된 입력값들을 받아오고
    if (Array.isArray(userInput)) {
      // userInput 변수가 배열 타입이라면
      const [title, description, people] = userInput; // 구조 분해 할당으로 각 데이터를 쪼개서 가져옴
      projectState.addProject(title, description, people);
      this.clearInput();
    }
  }

  /**
   * 작업을 마쳤다면 모든 인풋 value들을 공란으로 초기화
   */
  private clearInput() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  private configure() {
    this.formElement.addEventListener('submit', this.submitHandler.bind(this));
  }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
