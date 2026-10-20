import type { SchemaTypeDefinition } from 'sanity';
import { settings } from './settings';
import { doctor } from './doctor';
import { note } from './note';
import { callout, noteBody } from './body';
import { concern, faq, howWeBeginStep, service, source } from './lists';

/** 全站只有一份的文档：文档 ID 固定（网站按这个 ID 读），不能新建、删除或复制 */
export const SINGLETONS = ['settings', 'doctor'];

export const schemaTypes: SchemaTypeDefinition[] = [settings, doctor, note, noteBody, callout, service, faq, howWeBeginStep, concern, source];
