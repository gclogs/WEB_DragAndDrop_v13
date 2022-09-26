// Import stylesheets
import './style.css';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>TypeScript Starter</h1>`;

enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

type Listener = (items: Project[]) => void;

class ProjectState {
  private listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstace() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );

    this.projects.push(newProject);

    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstace();

interface Validatable {
  value: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value == 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length > validatableInput.minLength;
  }
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value == 'string'
  ) {
    isValid =
      isValid && validatableInput.value.length < validatableInput.maxLength;
  }

  if (
    validatableInput.min != null &&
    typeof validatableInput.value == 'number'
  ) {
    isValid = isValid && validatableInput.value > validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value == 'number'
  ) {
    isValid = isValid && validatableInput.value < validatableInput.max;
  }

  return isValid;
}

/**
 * 컴포넌트라는 추상 클래스 즉 설계도를 주는 클래스를 만들어,
 * 중복적인 코드 제거 및 재사용성의 효율성을 높이기 위해 만든 클래스
 *
 * 이렇게 따로 추상 클래스를 만들어 놓으면 유지보수도 좋고 협업할 때 '이것을 필요로 하는구나' 라고 즉각 알 수 있다.
 *
 * 추상 클래스 / 인터페이스 개념을 알고 있다면 좋겠지만 알고 있어도 이해하지 못하는 경우가 대다수라
 * 따로 부가적으로 설명하겠음
 */
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  // hostDivElement: T; // 호스트 요소
  element: U; // 폼 요소

  /**
   * templateId: <div id="templateId">
   * insertAtStart: afterbegin | beforeend
   * newElement: form element
   */
  constructor(templateId: string, insertAtStart: boolean, newElement: string) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (newElement) {
      // 새 요소에 어떠한 값이 들어가야 한다면
      this.element.id = newElement; // 새 요소로 받아온 값을 요소 id에 할당
    }

    this.attach(insertAtStart);
  }

  /**
   * 최초 삽입 즉 요소의 앞에 놓을 것인지 요소 후에 넣을 것인지 결정
   * appDiv 호스트 요소가 받아온 불값에 따라 연산이 달라짐
   *
   */
  private attach(insertAtBeginning: boolean) {
    appDiv.insertAdjacentElement(
      insertAtBeginning ? 'afterbegin' : 'beforeend',
      this.element
    );
  }

  abstract renderContent(): void;
  abstract configure(): void;
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    /**
     * 컴포넌트 클래스를 상속 받았으면 무조건 슈퍼를 해주어야함.
     * 그 안에 재사용 가능한 인자들을 작성하면 됨.
     *
     * 전 코드와 다른점은 많지만 같은 로직이다.
     */
    super('project-list', false, `${type}-projests`);
    this.assignedProjects = [];

    projectState.addListener((projects: Project[]) => {
      // 원하는 프로젝트에 출력하기 위해서 active에 들어갈 것인지 finished에 들어갈 것인지 필터링을 할거임
      const filterProjects = projects.filter((prjItem) => {
        if (this.type === 'active') {
          // 목록의 타입이 active라면
          return prjItem.status === ProjectStatus.Active; // 나 건들지마
        }
        return prjItem.status === ProjectStatus.Finished; // 그게 아니면 나는 finished야
      });
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.renderContent();
  }

  private renderProjects() {
    const listElement = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;

    // 중복을 피하기 위해 모든 목록 요소의 항목을 제거하여, 불필요한 리렌더링을 피함
    listElement.innerHTML = '';

    for (const projectItem of this.assignedProjects) {
      const listItem = document.createElement('li');
      listItem.textContent = projectItem.title;
      listElement.appendChild(listItem);
    }
  }

  /**
   * 추상클래스로 받아온 추상 메서드이기 때문에 private와 같은 접근 제한자 사용은 안된다
   * 왜 안될지는... 따로 답변 달아두도록 하겠음
   */
  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase();
  }

  /**
   * 컴포넌트 클래스 내부의 메소드이고, 추상 클래스라 꼭 필요한 추상 메서드이지만
   * ProjectList의 클래스 내부에서 그닥 중요하지 않다면, 로직 작성 없이 생성만 해두자
   */
  configure() {}
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;
  formElement = this.element; // formElement 라는 것을 명시적으로 알려주기 위해 추상클래스인 컴포넌트 내부의 private 변수인 this.element를 가져옴

  constructor() {
    super('project-input', true, `user-input`);

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

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescripiton = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

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

    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearInput();
    }
  }

  private clearInput() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  attach() {
    appDiv.insertAdjacentElement('afterbegin', this.formElement);
  }

  configure() {
    this.formElement.addEventListener('submit', this.submitHandler.bind(this));
  }

  renderContent() {}
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
