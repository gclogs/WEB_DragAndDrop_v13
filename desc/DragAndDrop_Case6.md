> [【한글자막】 Typescript :기초부터 실전형 프로젝트까지 with React + NodeJS](https://www.udemy.com/course/best-typescript-21/) 강의중 필자가 공부하다가 이해가 안되는 부분들을 깊이 이해하기 위해 작성 하였습니다. 틀린 부분 피드백 환영합니다

# 타입스크립트 p.131 ~ 133

- 수정된 사항을 가장 첫 문단으로 끌어오고 나머지 전체 코드는 맨 마지막에 달아두도록 하겠음.
- 드래그앤 드랍 프로젝트는 점차적으로 내용이 변화될 것이며, 노션 및 옵시디언으로 볼 수 있도록 서비스 폭을 넓힐 것

# 1. index.html

## 1-1. index.html 추가된 코드

```html
<template id="single-project">
  <li draggable="true">
    <h2></h2>
    <h3></h3>
    <p></p>
  </li>
</template>
```

## 1-2. 프로세스

- `single-proejct` id를 가지고 있는 템플릿 요소를 만든다
- `li` 태그 자식 요소로 `h2` / `h3` / `p` 태그를 작성한다.

## 1-3. 태그들의 할일

- 각 할 일은 우선 `li` 태그는 `project-list` 아이디를 가지고 있는 템플릿 요소 안으로 들어간다.
- 즉 `ul` 태그 안으로 들어간다는 말이다.
- 보기 쉽도록 따로 나눈 것이므로 오해 없길 바란다.

## 1-4. li 요소의 자식 요소들은 무엇을 하나

- `h2` 태그는 프로젝트의 제목
- `h3` 태그는 프로젝트의 설명
- `p` 태그는 프로젝트의 인원 수

- 위와 같은 항목으로 열거 되어 있다
- 직접 프로젝트 추가를 하게 되면 바로 알 수 있을 것이다.

# 2. app.ts

## 2-1. 컴포넌트 클래스

```ts
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
```

## 2-2. ProjectItem 클래스

```ts
/**
 * active와 finished 박스안에 추가될 아이템 클래스
 * 이 아이템은 active 박스에서 처음 생성 되지만,
 * 드래그를 통해 finished 박스 안에도 들어갈 수 있음
 */
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
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
```

## 2-3. ProjectList 클래스가 수정되었음

```ts
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
```

## 2-4. ProjectInput 클래스 역시 변동 되었음

```ts
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

  /**
   * (중략)
   * 이전과 동일한 코드들
   */
```

### index.html 전체 코드

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Drag And Drop</title>
  </head>
  <body>
    <template id="project-input">
      <form>
        <!-- 타이틀 -->
        <div class="form-control">
          <label for="title">Title</label>
          <input type="text" id="title" />
        </div>
        <!-- 설명 -->
        <div class="form-control">
          <label for="description">Description</label>
          <textarea id="description" cols="30" rows="10"></textarea>
        </div>
        <!-- 인원 수 -->
        <div class="form-control">
          <label for="people">People</label>
          <input type="number" id="people" value="1" min="1" />
        </div>
        <!-- 버튼 -->
        <button type="submit">프로젝트 추가</button>
      </form>
    </template>
    <template id="project-list">
      <section class="projects">
        <header>
          <h2></h2>
        </header>
        <ul></ul>
      </section>
    </template>
    <template id="single-project">
      <li draggable="true">
        <h2></h2>
        <h3></h3>
        <p></p>
      </li>
    </template>
    <div id="app"></div>
  </body>
</html>
```

### app.ts 전체 코드

```ts

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
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
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
```

# 참고자료

[추상(abstract) 클래스가 필요한 기본적인 이유](https://ryan-han.com/post/java/abstract_class/)
[[JAVA] 추상클래스 VS 인터페이스 왜 사용할까? 차이점, 예제로 확인 :: 마이자몽](https://myjamong.tistory.com/150)
