import React from 'react';

import '@inovua/reactdatagrid-community/index.css'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import {TypeColumn} from '@inovua/reactdatagrid-community/types/TypeColumn';
import {TypeFilterValue} from '@inovua/reactdatagrid-community/types/TypeFilterValue';
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import {imported_names, info_page} from './data';
import {Accordion, Stack, Form, InputGroup, Button} from 'react-bootstrap';

function App() {
	//const [loading, setLoading] = useState<boolean>(false);
	const [names, setNames] = React.useState(imported_names.names);
	const [minLength, setMinLength] = React.useState(1);
	const [maxLength, setMaxLength] = React.useState(30);
	const [endsWith, setEndsWith] = React.useState<string>('');
	const [cantEndWith, setCantEndWith] = React.useState<string>('');
	const [startsWith, setStartsWith] = React.useState<string>('');
	const [cantStartWith, setCantStartWith] = React.useState<string>('');
	const [doesntContain, setDoesntContain] = React.useState<string[]>([]);

	const columns: TypeColumn[] = [
		{ name: 'name', header: 'Nome', minWidth: 20, defaultFlex: 2 },
		{ name: 'gender', header: 'Género', minWidth: 20, defaultFlex: 1,
			filterEditor: SelectFilter,
			filterEditorProps: {
				placeholder: 'All',
				dataSource: imported_names.gender.map(x => {return {id: x.id, label: x.display}}),
			},
			render: ({ data }) => imported_names.gender.filter(x => x.id === data.gender)?.[0]?.display },
	]
	const filterValue: TypeFilterValue = [
		{ name: 'name', operator: 'contains', type: 'string', value: '' },
		{ name: 'gender', operator: 'eq', type: 'select', value: 1 },
	];
	const gridStyle = { minHeight: 700 }

	function setFilter() {
		let filtered = imported_names.names.filter(x => x.name.length >= minLength && x.name.length <= maxLength);
		startsWith && (filtered = filtered.filter(x => x.name.startsWith(startsWith)));
		cantStartWith && (filtered = filtered.filter(x => !x.name.startsWith(cantStartWith)));
		endsWith && (filtered = filtered.filter(x => x.name.endsWith(endsWith)));
		cantEndWith && (filtered = filtered.filter(x => !x.name.endsWith(cantEndWith)));
		doesntContain && doesntContain.length > 0 && (filtered = filtered.filter(x => !doesntContain.some(y => x.name.includes(y))));

		setNames(filtered);
	}
	function resetFilter() {
		setNames(imported_names.names);
		setStartsWith('');
		setCantStartWith('');
		setEndsWith('');
		setCantEndWith('');
		setDoesntContain([]);
	}

	return (
		<div className="App">
			<header className="App-header">
				<h1>Lista dos nomes próprios em Portugal</h1>
				<p>Esta aplicação baseia-se na lista de nomes próprios de cidadãos portugueses dos últimos três anos publicada pelo <a href={info_page} rel="noreferrer" target="_blank">Instituto dos Registos e do Notariado</a> (versão <a href={imported_names.download_url} target="_blank" rel="noreferrer">{imported_names.version}</a>)</p>
				<p>Tem como principal objectivo fornecer uma interface simples de pesquisa e filtragem avançada da lista de nomes.</p>

				<Stack direction="vertical" gap={3} className="m-4">
					<Accordion defaultActiveKey="0">
						<Accordion.Item eventKey="0">
							<Accordion.Header>Filtros avançados</Accordion.Header>
							<Accordion.Body>
								<Stack direction="vertical" gap={3}>
									<InputGroup className="mb-3">
										<InputGroup.Text>Tamanho: </InputGroup.Text>
										<Form.Control type="number" value={minLength} onChange={e => setMinLength(Number(e.target.value))} />
										<Form.Control type="number" value={maxLength} onChange={e => setMaxLength(Number(e.target.value))} />
									</InputGroup>
									<Stack direction="horizontal" gap={3}>
										<InputGroup className="mb-3">
											<InputGroup.Text>Tem de começar com: </InputGroup.Text>
											<Form.Control value={startsWith} onChange={e => setStartsWith(e.target.value)} />
										</InputGroup>
										<InputGroup className="mb-3">
											<InputGroup.Text>Não pode começar com: </InputGroup.Text>
											<Form.Control value={cantStartWith} onChange={e => setCantStartWith(e.target.value)} />
										</InputGroup>
									</Stack>
									<Stack direction="horizontal" gap={3}>
										<InputGroup className="mb-3">
											<InputGroup.Text>Tem de acabar com: </InputGroup.Text>
											<Form.Control value={endsWith} onChange={e => setEndsWith(e.target.value)} />
										</InputGroup>
										<InputGroup className="mb-3">
											<InputGroup.Text>Não pode acabar com: </InputGroup.Text>
											<Form.Control value={cantEndWith} onChange={e => setCantEndWith(e.target.value)} />
										</InputGroup>
									</Stack>
									<InputGroup className="mb-3">
										<InputGroup.Text>Não deve incluir (se mais que um separar com "<b>,</b>"):  </InputGroup.Text>
										<Form.Control aria-label="doesntContain" value={doesntContain} onChange={e => setDoesntContain(e.target.value.split(',').map(x => x.trim()))} />
									</InputGroup>
									<Stack direction="horizontal" gap={3} className="justify-content-end">
										<Button className="btn-dark" onClick={setFilter}>Set Filter</Button>
										<Button className="btn-dark" onClick={resetFilter}>Reset Filter</Button>
									</Stack>
								</Stack>
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
					<ReactDataGrid
						idProperty="id"
						columns={columns}
						dataSource={names}
						style={gridStyle}
						allowUnsort={false}
						editable={true}
						//		loading={loading}
						defaultFilterValue={filterValue}
					/>
				</Stack>
			</header>
		</div>
	);
}

export default App;
