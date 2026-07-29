const DEFAULT_PADDING = 6;
const DEFAULT_RADIUS = 6;
const DEFAULT_CARD_RADIUS = 10;
const DEFAULT_OFFSET = 12;
const SCHEMA_VERSION = 2;
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isLocalizedText(value) {
  return isRecord(value) && typeof value.default === "string";
}
const PLACEMENTS = ["top", "bottom", "left", "right", "auto"];
const ALIGNS = ["start", "center", "end"];
const DEVICES = ["mobile", "tablet", "desktop"];
const ACTION_TYPES = ["click", "input", "navigate", "none"];
function validateUrlMatch(value, path, errors) {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  const hasGlob = typeof value.glob === "string" && value.glob.length > 0;
  const hasRegex = typeof value.regex === "string" && value.regex.length > 0;
  if (!hasGlob && !hasRegex) {
    errors.push(`${path} must have a non-empty "glob" or "regex"`);
  }
  if (hasRegex) {
    try {
      new RegExp(value.regex);
    } catch {
      errors.push(`${path}.regex is not a valid regular expression`);
    }
  }
}
function validateCondition(value, path, errors) {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  if (value.url !== void 0) validateUrlMatch(value.url, `${path}.url`, errors);
  if (value.tags !== void 0) {
    if (!Array.isArray(value.tags) || !value.tags.every((t) => typeof t === "string" && t.length > 0)) {
      errors.push(`${path}.tags must be an array of non-empty strings`);
    }
  }
  if (value.firstVisitOnly !== void 0 && typeof value.firstVisitOnly !== "boolean") {
    errors.push(`${path}.firstVisitOnly must be a boolean`);
  }
  if (value.device !== void 0 && !DEVICES.includes(value.device)) {
    errors.push(`${path}.device must be one of ${DEVICES.join("|")}`);
  }
  if (value.unlessSeen !== void 0 && typeof value.unlessSeen !== "boolean") {
    errors.push(`${path}.unlessSeen must be a boolean`);
  }
  if (value.maxShows !== void 0 && (typeof value.maxShows !== "number" || value.maxShows < 0)) {
    errors.push(`${path}.maxShows must be a non-negative number`);
  }
}
function validateAction(value, path, errors) {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  if (!ACTION_TYPES.includes(value.type)) {
    errors.push(`${path}.type must be one of ${ACTION_TYPES.join("|")}`);
  }
  if (value.url !== void 0 && typeof value.url !== "string") {
    errors.push(`${path}.url must be a string`);
  }
  if (value.value !== void 0 && typeof value.value !== "string") {
    errors.push(`${path}.value must be a string`);
  }
}
function validate(json) {
  const errors = [];
  if (!isRecord(json)) {
    return { ok: false, errors: ["tour must be an object"] };
  }
  if (typeof json.id !== "string" || json.id.length === 0) {
    errors.push("tour.id must be a non-empty string");
  }
  if (typeof json.schemaVersion !== "number") {
    errors.push("tour.schemaVersion must be a number");
  }
  if (!isLocalizedText(json.title)) {
    errors.push('tour.title must be a localized text with a string "default"');
  }
  if (!Array.isArray(json.steps)) {
    errors.push("tour.steps must be an array");
  } else if (json.steps.length === 0) {
    errors.push("tour.steps must contain at least one step");
  } else {
    json.steps.forEach((step, i) => {
      if (!isRecord(step)) {
        errors.push(`steps[${i}] must be an object`);
        return;
      }
      if (typeof step.id !== "string" || step.id.length === 0) {
        errors.push(`steps[${i}].id must be a non-empty string`);
      }
      if (!Array.isArray(step.selectors) || step.selectors.length === 0 || !step.selectors.every((s) => typeof s === "string" && s.length > 0)) {
        errors.push(`steps[${i}].selectors must be a non-empty array of non-empty strings`);
      }
      if (!isLocalizedText(step.content)) {
        errors.push(`steps[${i}].content must be a localized text with a string "default"`);
      }
      if (step.placement !== void 0 && !PLACEMENTS.includes(step.placement)) {
        errors.push(`steps[${i}].placement must be one of ${PLACEMENTS.join("|")}`);
      }
      if (step.align !== void 0 && !ALIGNS.includes(step.align)) {
        errors.push(`steps[${i}].align must be one of ${ALIGNS.join("|")}`);
      }
      if (step.backLabel !== void 0 && typeof step.backLabel !== "string") {
        errors.push(`steps[${i}].backLabel must be a string`);
      }
      if (step.nextLabel !== void 0 && typeof step.nextLabel !== "string") {
        errors.push(`steps[${i}].nextLabel must be a string`);
      }
      if (step.pageUrl !== void 0) {
        validateUrlMatch(step.pageUrl, `steps[${i}].pageUrl`, errors);
      }
      if (step.condition !== void 0) {
        validateCondition(step.condition, `steps[${i}].condition`, errors);
      }
      if (step.action !== void 0) {
        validateAction(step.action, `steps[${i}].action`, errors);
      }
      if (step.overlay !== void 0 && typeof step.overlay !== "boolean") {
        errors.push(`steps[${i}].overlay must be a boolean`);
      }
    });
  }
  if (json.trigger !== void 0) {
    const tr = json.trigger;
    const types = ["manual", "load", "selector", "timer", "cta"];
    const corners = ["bottom-right", "bottom-left", "top-right", "top-left"];
    if (!isRecord(tr) || typeof tr.type !== "string" || !types.includes(tr.type)) {
      errors.push(`tour.trigger.type must be one of ${types.join("|")}`);
    } else if (tr.type === "selector" && (typeof tr.selector !== "string" || tr.selector.length === 0)) {
      errors.push("tour.trigger.selector must be a non-empty string");
    } else if (tr.type === "timer" && (typeof tr.delay !== "number" || tr.delay < 0)) {
      errors.push("tour.trigger.delay must be a non-negative number");
    } else if (tr.type === "cta") {
      if (typeof tr.text !== "string") errors.push("tour.trigger.text must be a string");
      if (typeof tr.button !== "string") errors.push("tour.trigger.button must be a string");
      if (!corners.includes(tr.corner)) errors.push(`tour.trigger.corner must be one of ${corners.join("|")}`);
      if (tr.offset !== void 0 && (typeof tr.offset !== "number" || tr.offset < 0)) {
        errors.push("tour.trigger.offset must be a non-negative number");
      }
    }
  }
  if (json.display !== void 0) {
    if (!isRecord(json.display)) {
      errors.push("tour.display must be an object");
    } else {
      for (const key of ["padding", "radius", "cardRadius", "offset", "alignOffset"]) {
        const v = json.display[key];
        if (v !== void 0 && (typeof v !== "number" || v < 0)) {
          errors.push(`tour.display.${key} must be a non-negative number`);
        }
      }
    }
  }
  if (json.rules !== void 0) {
    if (!Array.isArray(json.rules)) {
      errors.push("tour.rules must be an array");
    } else {
      json.rules.forEach((rule, i) => {
        if (!isRecord(rule)) {
          errors.push(`rules[${i}] must be an object`);
          return;
        }
        if (rule.tourId !== void 0 && typeof rule.tourId !== "string") {
          errors.push(`rules[${i}].tourId must be a string`);
        }
        if (rule.when === void 0) {
          errors.push(`rules[${i}].when is required`);
        } else {
          validateCondition(rule.when, `rules[${i}].when`, errors);
        }
      });
    }
  }
  if (errors.length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, tour: json };
}
const migrations = {
  0: (data) => ({ ...data, schemaVersion: 1 }),
  /**
   * v1 → v2: `audience` and `Condition.traits` collapse into `Condition.tags`.
   *
   * `audience: 'auth'` becomes the tag `authenticated` on every rule (and on a
   * tour with no rules, a rule is created, because the audience gate applied
   * unconditionally). Trait pairs become `key:value` tags, which is exactly what
   * they meant — matching was equality-only.
   */
  1: (data) => {
    const out = { ...data, schemaVersion: 2 };
    const audience = out.audience;
    delete out.audience;
    const audienceTag = audience === "auth" ? "authenticated" : audience === "guest" ? "guest" : null;
    const convert = (cond) => {
      const c = isRecord(cond) ? { ...cond } : {};
      const tags = Array.isArray(c.tags) ? [...c.tags] : [];
      if (isRecord(c.traits)) {
        for (const [k, v] of Object.entries(c.traits)) tags.push(`${k}:${String(v)}`);
      }
      delete c.traits;
      if (typeof c.role === "string" && c.role) tags.push(`role:${c.role}`);
      delete c.role;
      if (audienceTag) tags.push(audienceTag);
      if (tags.length > 0) c.tags = Array.from(new Set(tags));
      return c;
    };
    const rules = Array.isArray(out.rules) ? out.rules : [];
    if (rules.length > 0) {
      out.rules = rules.map((r) => {
        const rule = isRecord(r) ? { ...r } : {};
        rule.when = convert(rule.when);
        return rule;
      });
    } else if (audienceTag) {
      out.rules = [{ when: { tags: [audienceTag] } }];
    }
    if (Array.isArray(out.steps)) {
      out.steps = out.steps.map((st) => {
        const step = isRecord(st) ? { ...st } : {};
        if (step.condition !== void 0) step.condition = convert(step.condition);
        return step;
      });
    }
    return out;
  }
};
function versionOf(data) {
  return typeof data.schemaVersion === "number" ? data.schemaVersion : 0;
}
function migrate(input) {
  if (!isRecord(input)) {
    return { ok: false, errors: ["tour must be an object"] };
  }
  let data = { ...input };
  let version = versionOf(data);
  if (version > SCHEMA_VERSION) {
    return {
      ok: false,
      errors: [
        `tour.schemaVersion ${version} is newer than supported ${SCHEMA_VERSION}`
      ]
    };
  }
  while (version < SCHEMA_VERSION) {
    const step = migrations[version];
    if (!step) {
      return { ok: false, errors: [`no migration from schema version ${version}`] };
    }
    data = step(data);
    const next = versionOf(data);
    version = next > version ? next : version + 1;
  }
  return validate(data);
}
export {
  DEFAULT_CARD_RADIUS,
  DEFAULT_OFFSET,
  DEFAULT_PADDING,
  DEFAULT_RADIUS,
  SCHEMA_VERSION,
  migrate,
  validate
};
//# sourceMappingURL=index.js.map
