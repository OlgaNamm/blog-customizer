import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Article } from '../article/Article';
import { ArticleParamsForm } from '../article-params-form/ArticleParamsForm';
import { defaultArticleState } from 'src/constants/articleProps';
import { ArrowButton } from 'src/ui/arrow-button';
import styles from 'src/styles/index.module.scss';

export const App = () => {
	const [appliedSettings, setAppliedSettings] = useState(defaultArticleState);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);

	// загрузка
	useEffect(() => {
		const stored = localStorage.getItem('article-settings');
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				setAppliedSettings(parsed);
			} catch {
				setAppliedSettings(defaultArticleState);
			}
		}
		setIsLoaded(true);
	}, []);

	// сохранение
	useEffect(() => {
		if (isLoaded) {
			localStorage.setItem('article-settings', JSON.stringify(appliedSettings));
		}
	}, [appliedSettings, isLoaded]);

	if (!isLoaded) return null;

	return (
		<main
			className={clsx(styles.main)}
			style={
				{
					'--font-family': appliedSettings.fontFamilyOption.value,
					'--font-size': appliedSettings.fontSizeOption.value,
					'--font-color': appliedSettings.fontColor.value,
					'--container-width': appliedSettings.contentWidth.value,
					'--bg-color': appliedSettings.backgroundColor.value,
				} as React.CSSProperties
			}>
			<ArticleParamsForm
				currentSettings={appliedSettings}
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
				onApply={(settings) => {
					setAppliedSettings(settings);
					setIsSidebarOpen(false);
				}}
			/>
			<ArrowButton
				isOpen={isSidebarOpen}
				onClick={() => setIsSidebarOpen(!isSidebarOpen)}
			/>
			<Article />
		</main>
	);
};
