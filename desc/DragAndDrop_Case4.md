> Obsidian 으로 작성 되었습니다.

> [【한글자막】 Typescript :기초부터 실전형 프로젝트까지 with React + NodeJS](https://www.udemy.com/course/best-typescript-21/) 강의중 필자가 공부하다가 이해가 안되는 부분들을 깊이 이해하기 위해 작성 하였습니다. 틀린 부분 피드백 환영합니다

# 타입스크립트 p.128

### 참고 사항

1. #3 파트에서 추가되지 않은 내용이 있을 수 있습니다.
2. #4 파트에서 보충하였으니 강의를 보고 오신 분들은 .. 뒤죽박죽인점 양해 부탁드립니다. 죄송합니다

> - 복습 차원에서 다시금 정리하고자 좀 가독성을 높여서 작성 했습니다.
> - 내용을 이해하신 분들은 바로 `2. app.ts` 로 넘어가셔도 됩니다.

## 1. index.html

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
    <div id="app"></div>
  </body>
</html>
```

### a. project-list 템플릿 추가

`index.html` 에 코드가 추가되었습니다.

> 추가된 템플릿

```html
<template id="project-list">
  <section class="projects">
	<header>
	  <h2></h2>
	</header>
	<ul></ul>
  </section>
```

1. template은 `project-list` 아이디를 가지고 있고
2. section은 `projects` 클래스를 가지고 있네요.
3. h2 요소는 대목이 들어가 있구요.
4. ul 요소는 **목록 없는 요소** 로 우리가 프로젝트를 만들면 ul 요소 안에 자식 요소들이 추가되면서
5. 우리가 추가한 프로젝트들이 보일겁니다.

- 음.. #3 의 내용과 별반 다를게 없군요.
- 다음으로 볼 것은 스타일이 좀 달라진 것을 볼겁니다.

- 스타일이 좀 추가 됐거든요.

---

## 2. style.css

```css
h1,
h2 {
  font-family: Lato;
}

/* 입력칸 세팅 */
label,
input,
textarea {
  display: block;
}

label {
  font-weight: bold;
}

input,
textarea {
  font: inherit;
  padding: 0.2rem 0.4rem;
  width: 100%;
  max-width: 30rem;
  border: 1px solid #ccc;
}

/* 입력이 포커싱 됐을때 이벤트 */
input:focus,
textarea:focus {
  outline: none;
  background: #fff5f9;
}

/* 버튼 스타일 */
button {
  font: inherit;
  background: #ff0062;
  border: 1px solid #ff0062;
  cursor: pointer;
  color: white;
  padding: 0.75rem 1rem;
}

button:focus {
  outline: none;
}

button:hover,
button:active {
  background: #a80041;
  border-color: #a80041;
}

/* projects 구조 스타일 */
.projects {
  margin: 1rem;
  border: 1px solid #ff0062;
}

/* projects 엘리먼트 커스텀 */
.projects h2 {
  margin: 0;
  color: white;
}

.projects ul {
  list-style: none;
  margin: 0;
  padding: 1rem;
}

.projects li {
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.26);
  padding: 1rem;
  margin: 1rem;
}

.projects li h2 {
  color: #ff0062;
  margin: 0.5rem 0;
}

.projects li h3 {
  color: #575757;
  font-size: 1rem;
}

.project li p {
  margin: 0;
}

.projects header {
  background: #ff0062;
  height: 3.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* finished 프로젝트 스타일 */
#finished-projects li h2 {
  color: #0044ff;
}

#finished-projects .droppable {
  background: #d6e1ff;
}

#finished-projects {
  border-color: #0044ff;
}

#finished-projects header {
  background: #0044ff;
}

/* droppable 옵션 커스텀 */
.droppable {
  background: #ffe3ee;
}

/* 사용자 입력폼 커스텀 */
#user-input {
  margin: 1rem;
  padding: 1rem;
  border: 1px solid #ff0062;
  background: #f7f7f7;
}

```

### a. 프로젝트 스타일 작업

```css
/* projects 구조 스타일 */
.projects {
  margin: 1rem;
  border: 1px solid #ff0062;
}

/* projects 엘리먼트 커스텀 */
.projects h2 {
  margin: 0;
  color: white;
}

.projects ul {
  list-style: none;
  margin: 0;
  padding: 1rem;
}

.projects li {
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.26);
  padding: 1rem;
  margin: 1rem;
}

.projects li h2 {
  color: #ff0062;
  margin: 0.5rem 0;
}

.projects li h3 {
  color: #575757;
  font-size: 1rem;
}

.project li p {
  margin: 0;
}

.projects header {
  background: #ff0062;
  height: 3.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* finished 프로젝트 스타일 */
#finished-projects li h2 {
  color: #0044ff;
}

#finished-projects .droppable {
  background: #d6e1ff;
}

#finished-projects {
  border-color: #0044ff;
}

#finished-projects header {
  background: #0044ff;
}

/* 사용자 입력폼 커스텀 */
#user-input {
  margin: 1rem;
  padding: 1rem;
  border: 1px solid #ff0062;
  background: #f7f7f7;
}
```

- 스타일을 주면서 요소가 구분이 됨
- 사용자 입력폼이 조금 더 잘 보이게 되었고
- `active | finished` 결과도 잘 보이게 됨

- css 내용은 어려운 것이 없으니 넘어갈게요
- 궁금하거나 질문 있으면 댓글 달아주시면 성심성의껏 답변 해드립니다.

---

## 3. app.ts

```ts
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

  /**
   *
   */
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
```

### a. ProjectState 클래스 만들기

```ts
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
```

> 1. 구조가 좀 이상한데?

- 필자도 그렇게 생각한다. 이렇게 하나의 객체를 인스턴스로 받아오는 것을 싱글톤 패턴이라고 한다.

> 2.  싱글톤?? 뭔데??

- 싱글톤 패턴을 쉽게 말해서 `객체의 인스턴스가 오직 1개만 생성되는 패턴` 을 의미하는데 왜 사용할까?
- 그 이유는 `메모리` 인데, 1번의 new 연삱나로 고정된 메모리 영역을 할당 받기 때문에,
- 추후 해당 객체에 접근할 때 메모리 낭비를 방지할 수 있기 때문이다.

> 3.  아하... 이해가 안돼..

- 더 설명하면 내용이 길어지므로 `싱글톤이 무엇`이고 `왜 사용하는지`만 짚고 넘어 가겠다.
- 패턴에 대해서는 따로 링크를 걸어두겠다.

### b. 입력값 검증하기

```ts
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
```

> 1. 인터페이스 사용

- 이제 본격적으로 인터페이스를 사용하여 객체간에 같은 이름의 메서드를 사용하지만 기능 구현은 다르게 할때 인터페이스가 유용하다.

- 쉽게 말하자면 `다형성의 구현` 이라고 볼 수 있다.

> 2. 왜 쓰는건데?

- `코드의 변화에 유연하게 대응하기 위해서`이기도 하고,

- 인터페이스는 메서드의 틀을 미리 만들어 개발자 간의 의사소통 혼선을 줄여주고 다형성 개발에 유리함을 가져다주는 객체이다.

> 3. 음.. 그래도 모르겠네

- 몰라도 괜찮다 `소통 창구` 라고 생각하면 편하다.

- [자바 인터페이스 사용 이유 (Java Interface)](https://gofnrk.tistory.com/22) 글이 잘 정리 되어 있어 보면 단번에 이해될 것이다. 안되면 댓글로...

> 4. validate 함수

- `Validatable`을 타입을 가지면서 validate 함수에서 인풋값을 검증한다.

- 공백을 가지고 있는지, 길이는 맞는지, 필수적인지 등을 확인하고 개발자가 원하는 값이 들어가있으면 true를 리턴한다.

`여기서 유의할 점이 validate의 함수가 좀 이상하다. 이것은 #5에서 고치도록 하겠다.`

### b. 프로젝트 목록 출력하기

```ts
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
```

> 1. 프로젝트 상태 불러오기

- `ProjectState 클래스`를 `ProjectList 클래스`로 가져와서 출력하는 코드가 있는데,

  - `projectState 변수`에 접근하여 `assignedProjects 변수`에 `ProjectState 클래스`의 `projects 변수`를 할당 받는다.

  - 이때, `projectState 변수`에 접근하게 되면 그에 속하는 변수들을 사용할 수 있고,
  - `addListener` 메서드를 보다시피 인자값으로 받은 projects를 log에 찍어보면 내가 입력한 값이 나오는 것을 볼 수 있다.

> 2. `renderProjects` 함수는?

- `assignedProjects` 의 값을 순회하여,
- `${this.type}-projects-list` 의 id를 가진 listElement 변수는 목록 없는 요소에
- li 요소를 가진 listItem을 할당 받는다.

- `active | finished` 둘다 내가 입력한 값이 들어간 것을 확인할 수 있다.

# 참고자료

1. [싱글톤(Singleton) 패턴이란?](https://tecoble.techcourse.co.kr/post/2020-11-07-singleton/)
2. [인터페이스를 사용하는 이유](https://syundev.tistory.com/225)
3. [[TypeScript 독학] #7 이펙티브 타입스크립트(1)](https://velog.io/@bbaa3218/TypeScript-%EB%8F%85%ED%95%99-7-%EC%9D%B4%ED%8E%99%ED%8B%B0%EB%B8%8C-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8)
4. [인터페이스 왜 쓰는지 아세요?](https://okky.kr/articles/315082)
5. [Chapter 10 인터페이스](https://velog.io/@ruinak_4127/Chapter-10-%EC%9D%B8%ED%84%B0%ED%8E%98%EC%9D%B4%EC%8A%A4)
6. [자바[Java] 인터페이스[Interface] 사용과 이유](https://reinvestment.tistory.com/48)
7. [인터페이스 쓰는 이유가 뭔가요?](https://www.masterqna.com/android/88515/%EC%9D%B8%ED%84%B0%ED%8E%98%EC%9D%B4%EC%8A%A4-%EC%93%B0%EB%8A%94-%EC%9D%B4%EC%9C%A0%EA%B0%80-%EB%AD%94%EA%B0%80%EC%9A%94)
8. [자바 인터페이스 사용 이유 (Java Interface)](https://gofnrk.tistory.com/22)

### 논외

1. [유니티 인터페이스는 어떨 때 쓰는 건가요?](https://gall.dcinside.com/mgallery/board/view/?id=game_dev&no=71216)
