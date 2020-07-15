import { createMachine, assign } from "xstate";

// function updateSingle(prop) {
//   return (value) => assign({
//     [prop]: (context, event) => context[prop] = value
//   });
// }
enum StateName {
  idle = "idle",
  autobinding = "autobinding",
  success = "success",
  failure = "failure",
  onAutobinding = "onAutobinding",
  offAutobinding = "offAutobinding",
  cpc = "cpc",
  cpm = "cpm",
  maxView = "maxView",
  maxClick = "maxClick",
}
const tt = `рекламных форматов в ленте новостей`;
const tt1 = `содержащих ссылку/кнопку/сниппет, за исключением записей со статьями и опросами.`;
const tt3 = `с оплатой за 1000 показов (CPM)`;
const tt4 = `рекламных форматов в ленте новостей, а также для рекламы в Историях.`;
const cpm = "30 < _ < 1000 rub";
const cpmMax = "30 < _ < 1000 rub";
const cpcMax = "0.10 < _ < 150 rub";
const reqMax = "0.10 < _ < 10000 rub";
// reqMax day_limit = [100..1000000000]
// reqMax только autobind (на обуч?)
// goal_type 3 cost_type 3 ad_format 9?
// что значит в вк редактировать форму?
const req = "только для формата Сбор заявок";
const subscribtion = `только для формата Запись с кнопкой. Доступные кнопки: Вступить, Подписаться, Я пойду. И сообщество, от лица которого создано объявление. И Изменить/удалить кнопку или ссылку в ней нельзя. И Сообщество, от имени которого создано объявление, по-умолчанию находится в исключениях настроек объявления, убрать его нельзя.`;
const subMax = "1 < _ < 500 rub";
const cpc = "0.10 < _ < 150 rub";
// const upAutobinding = updateSingle('autobidding');

export const fetchMachine = createMachine(
  {
    id: "fetch",
    initial: StateName.cpm,
    context: {
      retries: 0,
      goal_type: 1,
      cost_type: 1,
      cpm: 5564,
      autobidding_max_cost: 1,
      autobidding: 0,
    },
    states: {
      // [StateName.idle]: {
      //   on: {
      //     FETCH: StateName.loading,
      //     a: {
      //       target: StateName.loading,
      //       actions: assign({
      //         goal_type: (context, event) => context.goal_type = 2
      //       })
      //     },
      //   }
      // },
      [StateName.cpm]: {
        on: {
          update: {
            target: StateName.cpm,
            cond: { type: cpm },
          },
          onAutobinding: {
            target: StateName.onAutobinding,
            actions: "updateAutobinding", // upAutobinding(1)
          },
        },
      },
      [StateName.cpc]: {
        on: {
          update: {
            target: StateName.cpc,
            cond: { type: cpc },
          },
          cpm: StateName.cpm,
          activities: ["activateCrosswalkLight"],
        },
      },
      [StateName.onAutobinding]: {
        on: {
          view: [
            {
              target: StateName.maxView,
              cond: { type: tt3 },
            },
            {
              target: StateName.maxView,
              cond: { type: tt4 },
            },
          ],
          click: [
            {
              target: StateName.maxClick,
              cond: { type: tt },
            },
            {
              target: StateName.maxClick,
              cond: { type: tt1 },
            },
          ],
          вступления: {
            target: "за вступления",
            cond: { type: subscribtion },
          },
          заявки: {
            target: "за заявки",
            cond: { type: req },
          },
          day_limit: StateName.onAutobinding,
          off: {
            target: StateName.offAutobinding,
            actions: "updateAutobinding",
          },
        },
      },
      "за вступления": {
        // подписки
        on: {
          // cpm = auto
          // платишь за cpm
          // период обучения?
          // у их dl для выхода из локального максимума
          // нужно добавить 1-5 rub
          // у их dl функция максимизации, по этому
          // надо ставить ниже желаемой
          next: StateName.onAutobinding,
          update: [
            {
              target: "за вступления",
              cond: { type: subMax },
            },
          ],
        },
      },
      "за заявки": {
        // cpm = auto
        // платишь за cpm
        // период обучения?
        on: {
          next: StateName.onAutobinding,
          update: [
            {
              target: "за заявки",
              cond: { type: reqMax },
            },
          ],
        },
      },
      [StateName.maxView]: {
        on: {
          next: StateName.onAutobinding,
          update: [
            {
              target: StateName.maxView,
              cond: { type: cpmMax },
            },
          ],
        },
      },
      [StateName.maxClick]: {
        // платишь за cpm
        on: {
          next: StateName.onAutobinding,
          update: [
            {
              target: StateName.maxClick,
              cond: { type: cpcMax },
            },
          ],
        },
      },
      [StateName.offAutobinding]: {
        on: {
          cpm: StateName.cpm,
          cpc: StateName.cpc,
          on: {
            target: StateName.onAutobinding,
            actions: "updateAutobinding",
          },
        },
      },
      // [StateName.success]: {
      //   type: 'final'
      // },
    },
  },
  {
    guards: {
      [tt]: (context, event) => true,
      [tt1]: (context, event) => true,
      [cpm]: (context, event) => true,
      [cpc]: (context, event) => true,
      [cpmMax]: (context, event) => true,
      [cpcMax]: (context, event) => true,
      [req]: (context, event) => true,
      [reqMax]: (context, event) => true,
      [subscribtion]: (context, event) => true,
      [subMax]: (context, event) => true,
    },
  }
);
