import { AST_NODE_TYPES, ESLintUtils, TSESTree } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator.withoutDocs;

function getDecoratorName(
  decorator: TSESTree.Decorator,
): string | undefined {
  const expr = decorator.expression;

  // @Injectable
  if (expr.type === AST_NODE_TYPES.Identifier) {
    return expr.name;
  }

  // @Injectable() or @Injectable({ scope: ... })
  if (
    expr.type === AST_NODE_TYPES.CallExpression &&
    expr.callee.type === AST_NODE_TYPES.Identifier
  ) {
    return expr.callee.name;
  }

  return undefined;
}

function hasDecorator(
  decorators: TSESTree.Decorator[],
  name: string,
): boolean {
  return decorators.some((d) => getDecoratorName(d) === name);
}

export const requireInjectDecorator = createRule({
  name: "require-inject-decorator",
  meta: {
    type: "problem",
    docs: {
      description:
        "Require explicit @Inject() on constructor parameters of @Injectable() classes.",
    },
    messages: {
      missingInject:
        "Constructor parameter '{{ name }}' in @Injectable class must have an explicit @Inject() decorator.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node) {
        if (!node.decorators?.length) {
          return;
        }
        if (!hasDecorator(node.decorators, "Injectable")) {
          return;
        }

        const constructor = node.body.body.find(
          (member): member is TSESTree.MethodDefinition =>
            member.type === AST_NODE_TYPES.MethodDefinition &&
            member.kind === "constructor",
        );

        if (!constructor) {
          return;
        }

        for (const param of constructor.value.params) {
          if (param.type === AST_NODE_TYPES.TSParameterProperty) {
            if (param.decorators?.length) {
              continue;
            }

            const inner = param.parameter;
            context.report({
              node: param,
              messageId: "missingInject",
              data: { name: inner.type === AST_NODE_TYPES.Identifier ? inner.name : inner.left.name },
            });
            continue;
          }

          if (param.type === AST_NODE_TYPES.Identifier) {
            if (param.decorators?.length) {
              continue;
            }

            context.report({
              node: param,
              messageId: "missingInject",
              data: { name: param.name },
            });
          }
        }
      },
    };
  },
});
