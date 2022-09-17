> Obsidian 으로 작성 되었습니다.

> [【한글자막】 Typescript :기초부터 실전형 프로젝트까지 with React + NodeJS](https://www.udemy.com/course/best-typescript-21/) 강의중 필자가 공부하다가 이해가 안되는 부분들을 깊이 이해하기 위해 작성 하였습니다. 틀린 부분 피드백 환영합니다

# 타입스크립트 p.126 ~ p.127

## #1 index.html 전체 코드

```html
<!DOCTYPE html>

<html lang="en">

  <head>

    <meta charset="UTF-8" />

    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Drag And Drop</title>

  </head>

  <body>

    <template id="project-input">

      <form>

        <!-- 타이틀 -->

        <div class="form-control">

          <label for="title">Title</label>

          <input type="text" id="title" />

        </div>

        <!-- 설명 -->

        <div class="form-control">

          <label for="description">Description</label>

          <textarea id="description" cols="30" rows="10"></textarea>

        </div>

        <!-- 인원 수 -->

        <div class="form-control">

          <label for="people">People</label>

          <input type="number" id="people" value="1" min="1" />

        </div>

        <!-- 버튼 -->

        <button type="submit">프로젝트 추가</button>

      </form>

    </template>

    <template id="project-list">

      <section class="projects">

        <header>

          <h2></h2>

        </header>

        <ul></ul>

      </section>

    </template>

    <div id="app"></div>

  </body>

</html>
```

## #1-2. index.html에 추가된 코드

```html
    <template id="project-list">

      <section class="projects">

        <header>

          <h2></h2>

        </header>

        <ul></ul>

      </section>

    </template>
```

### a. 새 템플릿 추가

- 입력을 만들었으니 출력이 나와야겠죠?
- 새 템플릿 `project-list` 아이디를 가진 요소를 만들어줍니다.
- 그리고 `header` 요소를 만들고 자식 요소로 `h2` 요소를 만들어 `active` 타입인지 `finished` 타입인지 확인해줍니다.

- `ul` 요소는 프로젝트 리스트 즉 결과물을 보여줄 요소입니다.

---

## 2-1. app.ts 전체 코드

```ts
// Import stylesheets

import './style.css';



// Write TypeScript code!

const appDiv: HTMLElement = document.getElementById('app');

appDiv.innerHTML = `<h1>TypeScript Starter</h1>`;


class ProjectList {

  templateElement: HTMLTemplateElement;

  element: HTMLElement; // 여기선 폼 엘리먼트가 아니라 그냥 엘리먼트

  assignedProjects = [];



  /**

   * project-list를 가진 아이디를 가져옴

   */

  constructor(private type: 'active' | 'finished') {

    this.templateElement = document.getElementById(

      'project-list'

    )! as HTMLTemplateElement;

    const importedNode = document.importNode(

      this.templateElement.content,

      true

    );

    this.element = importedNode.firstElementChild as HTMLFormElement;

    this.element.id = `${type}-projects`; // element의 아이디에 type 튜플중 선택된 값을 가져오며 projects를 구분 지음. ex) active-projects / finished-projects



    this.renderContent();

    this.attach();

  }



  /**

   * <template id="project-list"> 를 렌더링 하기 위해 만든 renderContent 함수

   */

  private renderContent() {

    const listId = `${this.type}-projects-list`;

    this.element.querySelector('ul')!.id = listId; // ul 태그 id에 listId의 값을 추가 ex) <ul id="{type}-projects-list">

    this.element.querySelector('h2')!.textContent = this.type.toUpperCase(); // h2 태그의 textContent는 대문자로

  }



  private attach() {

    appDiv.insertAdjacentElement('beforeend', this.element); // 여기선 맨 아래에 위치해야 하기 때문에 beforeend 값을 줌.

  }

}



class ProjectInput {

  templateElement: HTMLTemplateElement;

  hostDivElement: HTMLDivElement;

  formElement: HTMLFormElement;



  titleInputElement: HTMLInputElement;

  descriptionInputElement: HTMLInputElement;

  peopleInputElement: HTMLInputElement;



  constructor() {

    this.templateElement = document.getElementById(

      'project-input'

    )! as HTMLTemplateElement;



    const importedNode = document.importNode(

      this.templateElement.content,

      true

    );

    this.formElement = importedNode.firstElementChild as HTMLFormElement;

    this.formElement.id = 'user-input';



    this.titleInputElement = this.formElement.querySelector(

      '#title'

    ) as HTMLInputElement;

    this.descriptionInputElement = this.formElement.querySelector(

      '#description'

    ) as HTMLInputElement;

    this.peopleInputElement = this.formElement.querySelector(

      '#people'

    ) as HTMLInputElement;



    this.configure();

    this.attach();

  }



  private attach() {

    appDiv.insertAdjacentElement('afterbegin', this.formElement);

  }



  private submitHandler(event: Event) {

    event.preventDefault();

  }



  private configure() {

    this.formElement.addEventListener('submit', this.submitHandler.bind(this));

  }

}



const prjInput = new ProjectInput();

const activePrjList = new ProjectList('active');

const finishedPrjList = new ProjectList('finished');
```

## 2-2. app.ts 추가 코드

```ts

class ProjectList {

  templateElement: HTMLTemplateElement;

  element: HTMLElement; // 여기선 폼 엘리먼트가 아니라 그냥 엘리먼트

  assignedProjects = [];



  /**

   * project-list를 가진 아이디를 가져옴

   */

  constructor(private type: 'active' | 'finished') {

    this.templateElement = document.getElementById(

      'project-list'

    )! as HTMLTemplateElement;

    const importedNode = document.importNode(

      this.templateElement.content,

      true

    );

    this.element = importedNode.firstElementChild as HTMLFormElement;

    this.element.id = `${type}-projects`; // element의 아이디에 type 튜플중 선택된 값을 가져오며 projects를 구분 지음. ex) active-projects / finished-projects



    this.renderContent();

    this.attach();

  }



  /**

   * <template id="project-list"> 를 렌더링 하기 위해 만든 renderContent 함수

   */

  private renderContent() {

    const listId = `${this.type}-projects-list`;

    this.element.querySelector('ul')!.id = listId; // ul 태그 id에 listId의 값을 추가 ex) <ul id="{type}-projects-list">

    this.element.querySelector('h2')!.textContent = this.type.toUpperCase(); // h2 태그의 textContent는 대문자로

  }



  private attach() {

    appDiv.insertAdjacentElement('beforeend', this.element); // 여기선 맨 아래에 위치해야 하기 때문에 beforeend 값을 줌.

  }

}
```

### a. 프로젝트 리스트 만들기

- 프로젝트 인풋 바디 코드와 다를게 없다.
- 입력 결과값을 렌더링만 하면 되기 때문에 복붙 해도 좋고 따라 써도 상관없다.

- 다른 내용은 생성자 함수가 `acitve | finished` 중 튜플 타입을 받는 것과 콘텐트 내용이 들어간다는 것 말고는 없다.

### b. 렌더 콘텐트 생성

```ts
  private renderContent() {

    const listId = `${this.type}-projects-list`;

    this.element.querySelector('ul')!.id = listId; // ul 태그 id에 listId의 값을 추가 ex) <ul id="{type}-projects-list">

    this.element.querySelector('h2')!.textContent = this.type.toUpperCase(); // h2 태그의 textContent는 대문자로

  }
```

- 콘텐츠를 렌더링 하기 위해 `renderContent()` 함수를 만들었다.
- listId 변수의 용도는 어느 요소에 `${this.type}-projects-list` 의 id를 추가하기 위해 만들었고,
- `ul` 태그에 listId를 할당 해주었다. -> 결과값을 출력하기 위해서
- `h2` 태그는 어떤 타입을 가진 항목인지 보여주기 위해 만들었음
