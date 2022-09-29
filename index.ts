// Import stylesheets
import './style.css';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>TypeScript Starter</h1>`;

/**
 * dragStartHandler() : 드래깅이 '시작되면' 이벤트 발생
 * dragEndHandler() : 드래깅이 '끝나면' 이벤트 발생
 */
interface Draggable {
  dragStartHandler(event: Event): void;
  dragEndHandler(event: Event): void;
}

/**
 * dragOverHandler() : 드래그 오버시 발생하는 이벤트 (드래핑시 항상 일어남)
 * dragHandler() : 드롭 됐을 때의 상황을 보여줌
 * dragLeaveHanlder() : 비주얼 피드백을 주고자 할때 사용 / 드롭이 일어나지 않고 취소되거나 사용자가 해당 요소를 없앨떄 핸들링
 */
interface DragTarget {
  dragOverHandler(): void;
  dragHandler(): void;
  dragLeaveHandler(): void;
}

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
  hostElement: T; // 호스트 요소
  element: U; // 폼 요소

  /**
   * templateId: <div id="templateId">
   * hostElement: <div id="hostId">
   * insertAtStart: afterbegin | beforeend
   * newElement: form element
   *
   *
   * 1번째 인자 : single-project 아이디를 가진 템플릿 요소
   * 2번째 인자 : app 아이디를 가진 요소
   * 3번째 인자 : true라면 afterbegin 이고 false면 beforeend
   * 4번째 인자 : 어떠한 요소에 추가되는 id
   */
  constructor(
    templateId: string,
    hostId: string,
    insertAtStart: boolean,
    newElement: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostId)! as T;

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
   * 전역 appDiv를 사용할려고 했으나 호스팅 되어야할 요소가 따로 필요하게 됨.
   * ul 목록에 li 목록이 딸려오는 것처럼 호스트 요소를 만듦으로써 app 아이디에 어떠한 element를 딸려오게 만들어야 됨.
   *
   * ex.
   * <div id="app">
   *  <div id="app_box"></div>
   * </div>
   */
  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? 'afterbegin' : 'beforeend',
      this.element
    );
  }

  abstract renderContent(): void;
  abstract configure(): void;
}

/**
 * active와 finished 박스안에 추가될 아이템 클래스
 * 이 아이템은 active 박스에서 처음 생성 되지만,
 * 드래그를 통해 finished 박스 안에도 들어갈 수 있음
 */
class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  /**
   * 게터 메서드
   */
  get persons() {
    if (this.project.people === 1) {
      return '1 person';
    } else {
      return `${this.project.people} persons`;
    }
  }

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  dragStartHandler(event: DragEvent) {
    console.log(event);
  }
  dragEndHandler(_: Event) {
    console.log('DragEnd');
  }

  /**
   * 렌더링될 콘텐츠들을 할당함
   * h2 태그 : 제목
   * h3 태그 : 설명
   * p 태그 : 인원 수
   */
  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.project.description;
    this.element.querySelector('p')!.textContent = `${this.persons} assigned`; // 게터를 활용하여 유연한 사고
  }
  configure() {}
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
    super('project-list', 'app', false, `${type}-projests`);
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
      this.assignedProjects = filterProjects;
      this.renderProjects();
    });

    this.configure();
    this.renderContent();
  }

  private renderProjects() {
    const listElement = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;

    // 중복을 피하기 위해 모든 목록 요소의 항목을 제거하여, 불필요한 리렌더링을 피함
    listElement.innerHTML = '';

    /**
     * assignedProjects의 인덱스 값들을 가져오는데
     * ProjectItem
     */
    for (const projectItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, projectItem);
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
    super('project-input', 'app', true, `user-input`);

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

  configure() {
    this.formElement.addEventListener('submit', this.submitHandler.bind(this));
  }

  renderContent() {}
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
