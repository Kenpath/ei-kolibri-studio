const ActionTypeMap = {
    word: [
        {
            value: 'compare_files_using_word',
            text: 'Compare Files Using Word',
        },
    ],
    excel: [
        {
            value: 'excel_compare_cell_with_value',
            text: 'Excel Compare Cell With Value',
        },
        {
            value: 'compare_cells',
            text: 'Compare Cells'
        },
        {
            value: 'compare_column_widths',
            text: 'Compare Column Widths'
        },
        {
            value: 'excel_compare_files',
            text: 'Excel Compare Files'
        }
    ],
    ppt : [
        {
            value   : 'check_slide_layout',
            text : 'Check Slide Layout'
        },
        {
            value : 'check_selected_slide',
            text : 'Check Selected Slide'
        },
        {
            value : 'count_slides',
            text : 'Count Slides'
        }
    ],
    notepad : [
        {
            value : 'comparing_notepad_files',
            text : 'Comparing Notepad Files'
        }
    ]
}

export default ActionTypeMap;

export const ActionTypeList = ActionTypeMap;
