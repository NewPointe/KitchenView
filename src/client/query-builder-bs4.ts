/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

$(() => {

    const bs4Templates = {
        group: `
<div id="{{= it.group_id }}" class="rules-group-container">
  <div class="rules-group-header">
    <div class="btn-group float-right group-actions">
      <button type="button" class="btn btn-xs btn-secondary" data-add="rule">
        <i class="{{= it.icons.add_rule }}"></i> {{= it.translate("add_rule") }}
      </button>
      {{? it.settings.allow_groups===-1 || it.settings.allow_groups>=it.level }}
        <button type="button" class="btn btn-xs btn-secondary" data-add="group">
          <i class="{{= it.icons.add_group }}"></i> {{= it.translate("add_group") }}
        </button>
      {{?}}
      {{? it.level>1 }}
        <button type="button" class="btn btn-xs btn-danger" data-delete="group">
          <i class="{{= it.icons.remove_group }}"></i> {{= it.translate("delete_group") }}
        </button>
      {{?}}
    </div>
    <div class="btn-group group-conditions">
      {{~ it.conditions: condition }}
        <label class="btn btn-xs btn-primary">
          <input type="radio" name="{{= it.group_id }}_cond" value="{{= condition }}"> {{= it.translate("conditions", condition) }}
        </label>
      {{~}}
    </div>
    {{? it.settings.display_errors }}
      <div class="error-container"><i class="{{= it.icons.error }}"></i></div>
    {{?}}
  </div>
  <div class=rules-group-body>
    <div class=rules-list></div>
  </div>
</div>`,
        rule: `
<div id="{{= it.rule_id }}" class="rule-container">
  <div class="rule-header">
    <div class="btn-group float-right rule-actions">
      <button type="button" class="btn btn-xs btn-danger" data-delete="rule">
        <i class="{{= it.icons.remove_rule }}"></i> {{= it.translate("delete_rule") }}
      </button>
    </div>
  </div>
  {{? it.settings.display_errors }}
    <div class="error-container"><i class="{{= it.icons.error }}"></i></div>
  {{?}}
  <div class="rule-filter-container"></div>
  <div class="rule-operator-container"></div>
  <div class="rule-value-container"></div>
</div>`,
        filterSelect: `
{{ var optgroup = null; }}
<select class="form-control" name="{{= it.rule.id }}_filter">
  {{? it.settings.display_empty_filter }}
    <option value="-1">{{= it.settings.select_placeholder }}</option>
  {{?}}
  {{~ it.filters: filter }}
    {{? optgroup !== filter.optgroup }}
      {{? optgroup !== null }}</optgroup>{{?}}
      {{? (optgroup = filter.optgroup) !== null }}
        <optgroup label="{{= it.translate(it.settings.optgroups[optgroup]) }}">
      {{?}}
    {{?}}
    <option value="{{= filter.id }}" {{? filter.icon}}data-icon="{{= filter.icon}}"{{?}}>{{= it.translate(filter.label) }}</option>
  {{~}}
  {{? optgroup !== null }}</optgroup>{{?}}
</select>`,
        operatorSelect: `
{{? it.operators.length === 1 }}
<span>
{{= it.translate("operators", it.operators[0].type) }}
</span>
{{?}}
{{ var optgroup = null; }}
<select class="form-control {{? it.operators.length === 1 }}hide{{?}}" name="{{= it.rule.id }}_operator">
  {{~ it.operators: operator }}
    {{? optgroup !== operator.optgroup }}
      {{? optgroup !== null }}</optgroup>{{?}}
      {{? (optgroup = operator.optgroup) !== null }}
        <optgroup label="{{= it.translate(it.settings.optgroups[optgroup]) }}">
      {{?}}
    {{?}}
    <option value="{{= operator.type }}" {{? operator.icon}}data-icon="{{= operator.icon}}"{{?}}>{{= it.translate("operators", operator.type) }}</option>
  {{~}}
  {{? optgroup !== null }}</optgroup>{{?}}
</select>`,
        ruleValueSelect: `
{{ var optgroup = null; }}
<select class="form-control" name="{{= it.name }}" {{? it.rule.filter.multiple }}multiple{{?}}>
  {{? it.rule.filter.placeholder }}
    <option value="{{= it.rule.filter.placeholder_value }}" disabled selected>{{= it.rule.filter.placeholder }}</option>
  {{?}}
  {{~ it.rule.filter.values: entry }}
    {{? optgroup !== entry.optgroup }}
      {{? optgroup !== null }}</optgroup>{{?}}
      {{? (optgroup = entry.optgroup) !== null }}
        <optgroup label="{{= it.translate(it.settings.optgroups[optgroup]) }}">
      {{?}}
    {{?}}
    <option value="{{= entry.value }}">{{= entry.label }}</option>
  {{~}}
  {{? optgroup !== null }}</optgroup>{{?}}
</select>`
    };

    const fa5Icons = {
        add_group: "fas fa-plus-circle",
        add_rule: "fas fa-plus",
        remove_group: "fas fa-times",
        remove_rule: "fas fa-times",
        error: "fas fa-exclamation-triangle",
    };

    function tryJSON<TVal, TDefault>(val: string, defaultVal: TDefault) {
        try { return JSON.parse(val) as TVal; } catch (e) { return defaultVal; }
    }

    $('input.js-query-builder').each((i, input) => {
        if(input instanceof HTMLInputElement){
            input.type = "hidden";
            const qbOptionsString = input.dataset["qbOptions"];
            if(!qbOptionsString) return;
            const queryBuilderOptions = tryJSON<object, null>(qbOptionsString, null);
            const queryBuilderValue = tryJSON<object, null>(input.value, null);
            const $queryBuilder = $(document.createElement('div'));
            $queryBuilder.insertAfter(input);
            $queryBuilder.queryBuilder({ ...queryBuilderOptions, templates: bs4Templates, icons: fa5Icons });
            if (queryBuilderValue) $queryBuilder.queryBuilder('setRules', queryBuilderValue);
            $queryBuilder.on('rulesChanged.queryBuilder', e => {
                input.value = JSON.stringify($queryBuilder.queryBuilder('getRules'));
            });
        }
    });

});

interface JQuery {
    queryBuilder(methodName: string, ...methodParams: any[]): any;
    queryBuilder(config: Record<string, any>): any;
}
