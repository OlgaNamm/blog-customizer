import { FC, FormEvent, useEffect, useState, useRef, useCallback } from 'react';
import clsx from 'clsx';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Text } from 'src/ui/text';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import {
	defaultArticleState,
	ArticleStateType,
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	contentWidthArr,
	backgroundColors,
} from 'src/constants/articleProps';
import styles from './ArticleParamsForm.module.scss';

interface ArticleParamsFormProps {
	currentSettings: ArticleStateType;
	onApply: (settings: ArticleStateType) => void;
}

export const ArticleParamsForm: FC<ArticleParamsFormProps> = ({
	currentSettings,
	onApply,
}) => {
	const [formState, setFormState] = useState(currentSettings);
	const [isOpen, setIsOpen] = useState(false);
	const asideRef = useRef<HTMLElement>(null);

	useEffect(() => {
		setFormState(currentSettings);
	}, [currentSettings]);

	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (
				asideRef.current &&
				!asideRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	const handleChange = useCallback(
		<K extends keyof ArticleStateType>(
			field: K,
			value: ArticleStateType[K]
		) => {
			setFormState((prev) => ({ ...prev, [field]: value }));
		},
		[]
	);

	const handleApply = useCallback(
		(e: FormEvent) => {
			e.preventDefault();
			onApply(formState);
			setIsOpen(false);
		},
		[formState, onApply]
	);

	const handleReset = useCallback(
		(e: FormEvent) => {
			e.preventDefault();
			onApply(defaultArticleState);
			setIsOpen(false);
		},
		[onApply]
	);

	const toggleOpen = useCallback(() => {
		setIsOpen((prev) => !prev);
	}, []);

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={toggleOpen} />
			<aside
				ref={asideRef}
				className={clsx(styles.container, isOpen && styles.container_open)}>
				<form
					className={styles.form}
					onSubmit={handleApply}
					onReset={handleReset}>
					<div className={styles.title}>
						<Text as='h2' size={31} weight={800} uppercase align='left'>
							Задайте параметры
						</Text>
					</div>
					<div className={styles.fields}>
						<Select
							title='Шрифт'
							selected={formState.fontFamilyOption}
							options={fontFamilyOptions}
							onChange={(option) => handleChange('fontFamilyOption', option)}
						/>
						<RadioGroup
							name='fontSize'
							title='Размер шрифта'
							options={fontSizeOptions}
							selected={formState.fontSizeOption}
							onChange={(option) => handleChange('fontSizeOption', option)}
						/>
						<Select
							title='Цвет шрифта'
							selected={formState.fontColor}
							options={fontColors}
							onChange={(option) => handleChange('fontColor', option)}
						/>
						<hr className={styles.separator} />
						<Select
							title='Цвет фона'
							selected={formState.backgroundColor}
							options={backgroundColors}
							onChange={(option) => handleChange('backgroundColor', option)}
						/>
						<Select
							title='Ширина контента'
							selected={formState.contentWidth}
							options={contentWidthArr}
							onChange={(option) => handleChange('contentWidth', option)}
						/>
					</div>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
