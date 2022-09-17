// Import stylesheets
import './style.css';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>TypeScript Starter</h1>`;

class ProjectState {
  private listeners: any[] = []; // 폼에서 받아온 값들을 리스너 배열에 넣을거임
  private projects: any[] = []; //
  private static instance: ProjectState;

  private constructor() {}

  static getInstace() {
    if (this.instance) {
      // instance 변수에 데이터가 있으면
      return this.instance; // 그대로 반환
    }
    // 없으면
    this.instance = new ProjectState(); // 인스턴스로 받아옴
    return this.instance; // 나 간다용
  }

  /**
   * 함수를 받아올거임
   */
  addListener(listenerFn: Function) {
    this.listeners.push(listenerFn);
  }
}

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

  console.log(input);
}

class ProjectList {
  templateElement: HTMLTemplateElement;
  element: HTMLElement; // 여기선 폼 엘리먼트가 아니라 그냥 엘리먼트
  assignedProjects = [];

  /**
   * project-list를 가진 아이디를 가져옴
   */
  constructor(private type: 'active' | 'finished') {
    this.templateElement = document.getElementById(
      'project-list'
    )! as HTMLTemplateElement;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = `${type}-projects`; // element의 아이디에 type 튜플중 선택된 값을 가져오며 projects를 구분 지음. ex) active-projects / finished-projects

    this.renderContent();
    this.attach();
  }

  /**
   * <template id="project-list"> 를 렌더링 하기 위해 만든 renderContent 함수
   */
  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId; // ul 태그 id에 listId의 값을 추가 ex) <ul id="{type}-projects-list">
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase(); // h2 태그의 textContent는 대문자로
  }

  private attach() {
    appDiv.insertAdjacentElement('beforeend', this.element); // 여기선 맨 아래에 위치해야 하기 때문에 beforeend 값을 줌.
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

  private submitHandler(event: Event) {
    event.preventDefault();
  }

  private configure() {
    this.formElement.addEventListener('submit', this.submitHandler.bind(this));
  }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
