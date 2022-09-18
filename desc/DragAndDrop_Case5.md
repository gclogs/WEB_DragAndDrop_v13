> [【한글자막】 Typescript :기초부터 실전형 프로젝트까지 with React + NodeJS](https://www.udemy.com/course/best-typescript-21/) 강의중 필자가 공부하다가 이해가 안되는 부분들을 깊이 이해하기 위해 작성 하였습니다. 틀린 부분 피드백 환영합니다

# 타입스크립트 p.129 ~ p.130

## app.ts

```ts
// Import stylesheets
import './style.css';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>TypeScript Starter</h1>`;

/**
 * 열거형으로 상태 변환을 구체적으로 나타냄
 * 코드가 단순해지고 가독성이 좋음
 *
 * enum 키워드를 사용하는 이유는 상수 정의와 무분별한 상속 방지를 위함
 */
enum ProjectStatus {
  Active,
  Finished,
}

/**
 * 프로젝트 생성 구조 클래스를 구현
 * 새로운 객체를 만들때마다 번거로움과 유연한 코드를 만들기 위함
 *
 * 즉 항상 동일한 객체의 구축 방법을 취하기 위해 클래스를 구현한거
 */
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

/**
 * Project 클래스를 타입으로 갖는 items 배열 생성
 * 반환값은 void 아무것도 없음
 *
 * Listener 타입은 Project 클래스 생성자의 구조를 가져야 함
 * 타입을 더 명확히 하고 컴파일시 예외를 최대한 없애기 위함.
 */
type Listener = (items: Project[]) => void;

class ProjectState {
  /**
   * any 타입이던 private 필드들이
   * 각 타입을 가지면서 무엇을 가지는지 명확해짐
   */
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

  /**
   * listeners 배열이 Listener 타입이기 때문에
   * 매개변수 타입을 Listener로 맞춰야함
   */
  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active // 첫 프로젝트 생성은 active 프로젝트에 생성
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

class ProjectList {
  templateElement: HTMLTemplateElement;
  element: HTMLElement;
  assignedProjects: any[];

  constructor(private type: 'active' | 'finished') {
    // ProjectStatus를 사용할 수 있지만 보다 명확한 타입 명시가 필요하므로 생략 -> 문자가 들어가야 함. 상수가 들어가면 좀 복잡해짐
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
     * 여기도 역시 projects 배열이 Project 클래스를 타입으로 가지고 있기 때문에
     * 매개변수 타입을 Project로 받아야함
     */
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
    this.attach();
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

  private configure() {
    this.formElement.addEventListener('submit', this.submitHandler.bind(this));
  }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
```

### a. 구조 구현하기

```ts
/**
 * 열거형으로 상태 변환을 구체적으로 나타냄
 * 코드가 단순해지고 가독성이 좋음
 *
 * enum 키워드를 사용하는 이유는 상수 정의와 무분별한 상속 방지를 위함
 */
enum ProjectStatus {
  Active,
  Finished,
}

/**
 * 프로젝트 생성 구조 클래스를 구현
 * 새로운 객체를 만들때마다 번거로움과 유연한 코드를 만들기 위함
 *
 * 즉 항상 동일한 객체의 구축 방법을 취하기 위해 클래스를 구현한거
 */
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

/**
 * Project 클래스를 타입으로 갖는 items 배열 생성
 * 반환값은 void 아무것도 없음
 *
 * Listener 타입은 Project 클래스 생성자의 구조를 가져야 함
 * 타입을 더 명확히 하고 컴파일시 예외를 최대한 없애기 위함.
 */
type Listener = (items: Project[]) => void;

class ProjectState {
  /**
   * any 타입이던 private 필드들이
   * 각 타입을 가지면서 무엇을 가지는지 명확해짐
   */
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

  /**
   * listeners 배열이 Listener 타입이기 때문에
   * 매개변수 타입을 Listener로 맞춰야함
   */
  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active // 첫 프로젝트 생성은 active 프로젝트에 생성
    );

    this.projects.push(newProject);

    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
```

1. `listeners` 배열과 `projects` 배열에 타입 부여

2. active와 finished를 열거형을 선언해 가독성을 높임

3. 프로젝트 생성 구조 클래스를 구현 -> 동일한 객체의 구축 방법을 취함

4. `listeners` 배열의 타입은 `Listener 타입`을 가져옴

5. `projects` 배열의 타입은 `Project 클래스`를 가져옴

6. `numProject 객체`를 `Project 클래스`의 인스턴스로 받아오면서 프로젝트 구현

### b. 검증 로직 재구현

```ts
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
```

### c. 프로젝트 개선사항 반영

```ts
class ProjectList {
  templateElement: HTMLTemplateElement;
  element: HTMLElement;
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    // ProjectStatus를 사용할 수 있지만 보다 명확한 타입 명시가 필요하므로 생략 -> 문자가 들어가야 함. 상수가 들어가면 좀 복잡해짐
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
     * 여기도 역시 projects 배열이 Project 클래스를 타입으로 가지고 있기 때문에
     * 매개변수 타입을 Project로 받아야함
     */
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
    this.attach();
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

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase();
  }

  private attach() {
    appDiv.insertAdjacentElement('beforeend', this.element);
  }
}
```

1. 중복 출력이 되던 문제를 고치기 위해 로직 필터링을 거침

2. `assginedProejct 변수` 역시 `project` 구조를 가지고 있기 때문에 `Project 클래스`를 타입으로 가져옴

# 참고자료

1. [Java: enum의 뿌리를 찾아서...](https://www.nextree.co.kr/p11686/)

2. [[2017.08.21] 12. 왜 Enum을 사용할까?](https://heepie.me/32)
