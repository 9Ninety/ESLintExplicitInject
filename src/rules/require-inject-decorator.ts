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

function findMatchingDecorator(
  decorators: TSESTree.Decorator[],
  names: string[],
): string | undefined {
  for (const d of decorators) {
    const name = getDecoratorName(d);
    if (name !== undefined && names.includes(name)) {
      return name;
    }
  }
  return undefined;
}

type Options = [{ decorators: string[] }];

export const requireInjectDecorator = createRule<Options, "missingInject">({
  name: "require-inject-decorator",
  meta: {
    type: "problem",
    docs: {
      description:
        "Require explicit @Inject() on constructor parameters of classes with specific decorators.",
    },
    messages: {
      missingInject:
        "Constructor parameter '{{ name }}' in @{{ decorator }} class must have an explicit @Inject() decorator.",
    },
    schema: [
      {
        type: "object",
        properties: {
          decorators: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ decorators: ["Injectable"] }],
  create(context) {
    const { decorators } = context.options[0] ?? { decorators: ["Injectable"] };

    return {
      ClassDeclaration(node) {
        if (!node.decorators?.length) {
          return;
        }

        const matchedDecorator = findMatchingDecorator(node.decorators, decorators);
        if (!matchedDecorator) {
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
              data: {
                name: inner.type === AST_NODE_TYPES.Identifier ? inner.name : inner.left.name,
                decorator: matchedDecorator,
              },
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
              data: { name: param.name, decorator: matchedDecorator },
            });
          }
        }
      },
    };
  },
});
